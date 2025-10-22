import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, Users, FileText, Brain } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">AIInterviewer</span>
          </div>
          <div className="flex space-x-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Sign Up Free</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Master Your Next Interview with
          <span className="text-blue-600"> AI</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Practice with our intelligent AI interviewer that provides real-time feedback, 
          personalized questions, and realistic interview scenarios for any role.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Start Practicing Free
            </Button>
          </Link>
          <Link href="/demo">
            <Button size="lg" variant="outline">
              Watch Demo
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Why Choose AIInterviewer?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Mic className="h-12 w-12 text-blue-600" />
              </div>
              <CardTitle>Voice-based Practice</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-lg">
                Speak naturally with our AI interviewer. Get real-time responses and feedback 
                just like a real human conversation.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <FileText className="h-12 w-12 text-green-600" />
              </div>
              <CardTitle>Resume-based Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-lg">
                Upload your resume and get personalized questions tailored to your 
                experience and skills.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Users className="h-12 w-12 text-purple-600" />
              </div>
              <CardTitle>Multiple Domains</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-lg">
                Practice for various roles: Frontend, Backend, Full Stack, Data Science, 
                and more. Choose your difficulty level.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Ace Your Next Interview?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of candidates who improved their interview skills with AI.
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="text-blue-600">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}