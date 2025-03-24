'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Mail, Sparkles, Zap, Shield } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          Create Beautiful HTML Emails with AI
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          The best AI email builder for creating responsive email templates, newsletters, and marketing emails
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/editor">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Start Creating <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/templates">
            <Button size="lg" variant="outline">
              Browse Templates
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card>
          <CardHeader>
            <Sparkles className="h-8 w-8 text-primary mb-2" />
            <CardTitle>AI-Powered Generation</CardTitle>
            <CardDescription>
              Create professional email designs instantly with our automated email design generator
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <Mail className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Responsive Templates</CardTitle>
            <CardDescription>
              Generate HTML emails that look great on all devices with our responsive email builder
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <Zap className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Quick & Easy</CardTitle>
            <CardDescription>
              The fastest way to create marketing emails with AI-powered assistance
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <Shield className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Professional Quality</CardTitle>
            <CardDescription>
              Best AI email builder for creating high-quality, engaging email content
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>AI Newsletter Creator</CardTitle>
            <CardDescription>
              Create engaging newsletters with our AI-powered email template generator
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>• Intelligent content suggestions</li>
              <li>• Customizable templates</li>
              <li>• Responsive design</li>
              <li>• Brand consistency</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Marketing Email Generator</CardTitle>
            <CardDescription>
              Generate compelling marketing emails with our AI email design tool
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>• Conversion-focused designs</li>
              <li>• A/B testing ready</li>
              <li>• Mobile-first approach</li>
              <li>• Analytics integration</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 