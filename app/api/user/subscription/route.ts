import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    console.log('Subscription API: Starting request');
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Present' : 'Missing');
    console.log('DIRECT_URL:', process.env.DIRECT_URL ? 'Present' : 'Missing');
    
    const session = await getServerSession();
    console.log('Subscription API: Session:', session?.user?.email);

    if (!session?.user?.email) {
      console.log('Subscription API: No session found');
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        subscription: true,
        nextRenewal: true,
        generations: true,
      },
    });

    console.log('Subscription API: User data:', user);

    if (!user) {
      console.log('Subscription API: User not found');
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Subscription API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 