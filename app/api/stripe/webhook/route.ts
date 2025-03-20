import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';
import { trackUserAction, updateDailyAnalytics } from '@/lib/analytics';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = headers().get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan;

        if (!userId || !plan) {
          return new NextResponse('Missing metadata', { status: 400 });
        }

        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { subscription: true },
        });

        await prisma.user.update({
          where: { id: userId },
          data: {
            subscription: plan,
            stripeSubscriptionId: session.subscription as string,
            stripePriceId: session.metadata?.priceId,
            stripeCurrentPeriodEnd: session.expires_at 
              ? new Date(session.expires_at * 1000)
              : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            nextRenewal: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          },
        });

        // Track subscription change
        await trackUserAction(
          userId,
          'subscription_change',
          user?.subscription,
          plan
        );

        // Update daily analytics
        await updateDailyAnalytics();
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription;
        const user = await prisma.user.findFirst({
          where: { stripeSubscriptionId: subscriptionId as string },
        });

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              stripeCurrentPeriodEnd: new Date(invoice.period_end * 1000),
            },
          });

          // Track renewal
          await trackUserAction(
            user.id,
            'subscription_renewed',
            user.subscription,
            user.subscription
          );
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const user = await prisma.user.findFirst({
          where: { stripeSubscriptionId: subscription.id },
        });

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              subscription: 'Free Plan',
              stripeSubscriptionId: null,
              stripePriceId: null,
              stripeCurrentPeriodEnd: null,
            },
          });

          // Track cancellation
          await trackUserAction(
            user.id,
            'subscription_cancelled',
            user.subscription,
            'Free Plan'
          );

          // Update daily analytics
          await updateDailyAnalytics();
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
} 