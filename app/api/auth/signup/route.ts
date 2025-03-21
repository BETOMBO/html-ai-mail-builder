import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Present' : 'Missing');
    console.log('DIRECT_URL:', process.env.DIRECT_URL ? 'Present' : 'Missing');
    const { name, email, password } = await req.json();

    // Validate input
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please enter a valid email' },
        { status: 400 }
      );
    }

    if (!password || password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { message: 'User created successfully', user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
} 