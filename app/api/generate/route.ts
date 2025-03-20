import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Function to get token count from completion response
function getTokenCountFromResponse(completion: any) {
  return completion.usage?.total_tokens || 0;
}

// Function to calculate tokens used in a request
async function calculateTokensUsed(prompt: string, response: string) {
  console.log('Calculating tokens for:', { promptLength: prompt.length, responseLength: response.length });
  try {
    // Calculate tokens for prompt and response
    console.log('Calculating prompt tokens...');
    const promptTokens = await openai.embeddings.create({
      input: prompt,
      model: "text-embedding-ada-002"
    }).then(res => {
      console.log('Prompt tokens:', res.usage.total_tokens);
      return res.usage.total_tokens;
    });

    console.log('Calculating response tokens...');
    const responseTokens = await openai.embeddings.create({
      input: response,
      model: "text-embedding-ada-002"
    }).then(res => {
      console.log('Response tokens:', res.usage.total_tokens);
      return res.usage.total_tokens;
    });

    // Add some buffer for system messages and overhead
    const systemMessageTokens = 50;
    const totalTokens = promptTokens + responseTokens + systemMessageTokens;
    console.log('Total tokens calculated:', { promptTokens, responseTokens, systemMessageTokens, totalTokens });
    return totalTokens;
  } catch (error) {
    console.error('Error calculating tokens:', error);
    // Return a conservative estimate if token calculation fails
    const estimate = Math.ceil((prompt.length + response.length) / 4);
    console.log('Using fallback token estimation:', estimate);
    return estimate;
  }
}

export async function POST(request: Request) {
  console.log('Starting generate endpoint');
  console.log('OpenAI API Key exists:', !!process.env.OPENAI_API_KEY);
  
  try {
    console.log('Getting user session...');
    const session = await getServerSession();
    console.log('Session:', { 
      exists: !!session, 
      userEmail: session?.user?.email,
      isAuthenticated: !!session?.user 
    });

    if (!session?.user?.email) {
      console.log('Authentication failed: No user email in session');
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get user's current generation count
    console.log('Fetching user generation count...');
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { generations: true },
    });
    console.log('User generation count:', user?.generations);

    if (!user) {
      console.log('User not found in database');
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const { prompt } = await request.json();
    console.log('Received prompt:', prompt ? `Length: ${prompt.length}` : 'No prompt');
    
    if (!prompt) {
      console.log('No prompt provided, returning current generation count');
      return NextResponse.json({ 
        generationsRemaining: user.generations 
      });
    }

    // Check if user has generations remaining
    if (user.generations <= 0) {
      console.log('No generations remaining:', { available: user.generations });
      return NextResponse.json(
        { error: 'No generations remaining' },
        { status: 403 }
      );
    }

    // Make the OpenAI API call
    console.log('Making OpenAI API call...');
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert email template generator. Generate clean, responsive HTML email templates based on user prompts. Use inline styles for email client compatibility. Return only the HTML code without any explanations or markdown formatting."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
    });
    console.log('OpenAI API call successful');

    const generatedContent = completion.choices[0].message.content || '';
    console.log('Generated content length:', generatedContent.length);

    // Decrement user's generation count
    console.log('Updating user generation count...');
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        generations: {
          decrement: 1
        }
      },
      select: { generations: true }
    });
    console.log('New generation count:', updatedUser.generations);

    console.log('Request completed successfully');
    return NextResponse.json({
      content: generatedContent,
      generationsRemaining: updatedUser.generations
    });

  } catch (error) {
    console.error('Error in generate endpoint:', error);
    // Log detailed error information
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    return NextResponse.json(
      { error: 'Failed to generate email template' },
      { status: 500 }
    );
  }
} 