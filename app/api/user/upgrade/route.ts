import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';

const plans = {
  'Free Plan': { tokens: 5 },
  'Starter Plan': { tokens: 250 },
  'Pro Plan': { tokens: 1000 },
  'Premium Plan': { tokens: 3000 },
};

export async function POST(request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { plan } = body;

    if (!plan || !plans[plan]) {
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      );
    }

    // Set next renewal to 30 days from now
    const nextRenewal = new Date();
    nextRenewal.setDate(nextRenewal.getDate() + 30);

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        subscription: plan,
        tokens: plans[plan].tokens,
        nextRenewal,
      },
      select: {
        subscription: true,
        tokens: true,
        nextRenewal: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error upgrading plan:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 