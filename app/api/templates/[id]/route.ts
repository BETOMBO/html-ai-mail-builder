import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const template = await prisma.template.findUnique({
      where: {
        id: params.id,
        user: {
          email: session.user.email
        }
      },
      select: {
        id: true,
        name: true,
        html: true,
        css: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(template);

  } catch (error) {
    console.error('Error fetching template:', error);
    return NextResponse.json(
      { error: 'Failed to fetch template' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { name, html, css } = await request.json();

    const template = await prisma.template.update({
      where: {
        id: params.id,
        user: {
          email: session.user.email
        }
      },
      data: {
        name,
        html,
        css,
      },
      select: {
        id: true,
        name: true,
        html: true,
        css: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json(template);

  } catch (error) {
    console.error('Error updating template:', error);
    return NextResponse.json(
      { error: 'Failed to update template' },
      { status: 500 }
    );
  }
} 