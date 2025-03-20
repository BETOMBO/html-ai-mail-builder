import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401 }
      );
    }

    if (session.user.id !== params.userId) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 403 }
      );
    }

    const tokenBalance = await prisma.tokenBalance.findUnique({
      where: { userId: params.userId },
    });

    if (!tokenBalance) {
      // Create initial token balance for new users
      const newTokenBalance = await prisma.tokenBalance.create({
        data: {
          userId: params.userId,
          balance: 5, // Default free tokens
        },
      });

      return new NextResponse(JSON.stringify(newTokenBalance));
    }

    return new NextResponse(JSON.stringify(tokenBalance));
  } catch (error) {
    console.error('Error fetching token balance:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401 }
      );
    }

    if (session.user.id !== params.userId) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 403 }
      );
    }

    const { amount, type, description } = await request.json();

    const result = await prisma.$transaction(async (tx) => {
      const tokenBalance = await tx.tokenBalance.findUnique({
        where: { userId: params.userId },
      });

      if (!tokenBalance) {
        throw new Error('Token balance not found');
      }

      if (type === 'USAGE' && tokenBalance.balance < amount) {
        throw new Error('Insufficient tokens');
      }

      const updatedBalance = await tx.tokenBalance.update({
        where: { userId: params.userId },
        data: {
          balance: type === 'USAGE' 
            ? { decrement: amount }
            : { increment: amount },
        },
      });

      await tx.transaction.create({
        data: {
          userId: params.userId,
          type,
          amount,
          description,
        },
      });

      return updatedBalance;
    });

    return new NextResponse(JSON.stringify(result));
  } catch (error) {
    console.error('Error updating token balance:', error);
    return new NextResponse(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error'
      }),
      { status: 500 }
    );
  }
} 