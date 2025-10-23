'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, Users, FileText, Star, ArrowRight, Play, Sparkles, CheckCircle, Crown } from 'lucide-react';

const currentDate = new Date();
const currentYear = currentDate.getFullYear();

// Particle component that only renders on client
function FloatingParticles() {
  const [particles, setParticles] = useState<Array<{ left: string; top: string; delay: string; duration: string }>>([]);

  useEffect(() => {
    // Generate particles only on client side
    const generatedParticles = [...Array(20)].map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${10 + Math.random() * 10}s`
    }));
    setParticles(generatedParticles);
  }, []);

  if (particles.length === 0) {
    return null; // Don't render anything during SSR
  }

  return (
    <div className="absolute inset-0">
      {particles.map((particle, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-amber-200 rounded-full opacity-20 animate-bounce"
          style={{
            left: particle.left,
            top: particle.top,
            animationDelay: particle.delay,
            animationDuration: particle.duration
          }}
        ></div>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-amber-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-700 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-slate-700 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>

      {/* Floating Particles */}
      <FloatingParticles />

      {/* Navigation */}
      <nav className="relative border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Crown className="h-10 w-10 text-amber-400" />
              <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-amber-200" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-blue-400 bg-clip-text text-transparent">
              AIInterviewer
            </span>
          </div>
          <div className="flex space-x-3">
            <Link href="/login">
              <Button variant="ghost" className="text-white hover:text-amber-300 hover:bg-white/10 border border-transparent hover:border-amber-400/30 transition-all duration-300">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-gradient-to-r from-amber-500 to-blue-600 hover:from-amber-600 hover:to-blue-700 text-white shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-300 transform hover:scale-105">
                <Sparkles className="w-4 h-4 mr-2" />
                Sign Up Free
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative container mx-auto px-4 py-24 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-amber-400/30 mb-8">
            <Star className="w-4 h-4 text-amber-300 mr-2 fill-current" />
            <span className="text-amber-300 font-medium">Trusted by 10,000+ job seekers</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-white via-amber-200 to-blue-200 bg-clip-text text-transparent">
              Master Your Next
            </span>
            <br />
            <span className="bg-gradient-to-r from-amber-400 to-blue-500 bg-clip-text text-transparent">
              Interview with AI
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed max-w-3xl mx-auto">
            Practice with our intelligent AI interviewer that provides{' '}
            <span className="text-amber-300 font-semibold">real-time feedback</span>, 
            personalized questions, and realistic interview scenarios for any role.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-16">
            <Link href="/register">
              <Button size="lg" className="bg-gradient-to-r from-amber-500 to-blue-600 hover:from-amber-600 hover:to-blue-700 text-white text-lg px-8 py-6 shadow-2xl shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-300 transform hover:scale-105 group">
                <Sparkles className="w-5 h-5 mr-3 group-hover:rotate-180 transition-transform duration-500" />
                Start Practicing Free
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="border-2 border-amber-400/50 text-amber-300 hover:bg-amber-400/10 hover:border-amber-400 text-lg px-8 py-6 backdrop-blur-sm transition-all duration-300 group">
                <Play className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
                Watch Demo
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-400 mb-2">98%</div>
              <div className="text-gray-400">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">50K+</div>
              <div className="text-gray-400">Interviews Conducted</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">4.9/5</div>
              <div className="text-gray-400">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">
          <span className="bg-gradient-to-r from-amber-400 to-blue-500 bg-clip-text text-transparent">
            Why Choose AIInterviewer?
          </span>
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: <Mic className="h-12 w-12" />,
              title: "Voice-based Practice",
              description: "Speak naturally with our AI interviewer. Get real-time responses and feedback just like a real human conversation.",
              color: "from-amber-500 to-orange-500",
              bgColor: "bg-gradient-to-br from-amber-500/10 to-orange-500/10"
            },
            {
              icon: <FileText className="h-12 w-12" />,
              title: "Resume-based Questions",
              description: "Upload your resume and get personalized questions tailored to your experience and skills.",
              color: "from-blue-500 to-cyan-500",
              bgColor: "bg-gradient-to-br from-blue-500/10 to-cyan-500/10"
            },
            {
              icon: <Users className="h-12 w-12" />,
              title: "Multiple Domains",
              description: "Practice for various roles: Frontend, Backend, Full Stack, Data Science, and more. Choose your difficulty level.",
              color: "from-amber-600 to-blue-600",
              bgColor: "bg-gradient-to-br from-amber-600/10 to-blue-600/10"
            }
          ].map((feature, index) => (
            <Card key={index} className={`${feature.bgColor} border-white/10 backdrop-blur-sm shadow-2xl transform hover:scale-105 transition-all duration-500 group hover:shadow-amber-500/10`}>
              <CardHeader className="text-center">
                <div className={`flex justify-center mb-4 p-4 rounded-2xl bg-gradient-to-r ${feature.color} w-20 h-20 mx-auto items-center group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 text-lg leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      {/* <section className="relative container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-16 text-white">
          Loved by Job Seekers Worldwide
        </h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {[
            {
              name: "Sarah Chen",
              role: "Software Engineer at Google",
              text: "AIInterviewer helped me land my dream job. The realistic practice sessions built my confidence tremendously!",
              rating: 5
            },
            {
              name: "Marcus Johnson",
              role: "Product Manager at Meta",
              text: "The personalized feedback transformed my interview skills. I went from nervous to confident in just 2 weeks!",
              rating: 5
            }
          ].map((testimonial, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 text-lg mb-4 italic">&quot;{testimonial.text}&quot;</p>
              <div>
                <div className="font-semibold text-amber-300">{testimonial.name}</div>
                <div className="text-gray-400 text-sm">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="relative bg-gradient-to-r from-amber-500/20 via-blue-500/20 to-slate-500/20 backdrop-blur-sm border-t border-b border-white/10 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Ace Your Next Interview?
          </h2>
          <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of candidates who improved their interview skills with AI and landed their dream jobs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            {[
              "Personalized AI Interviews",
              "Real-time Feedback",
              "Unlimited Practice Sessions"
            ].map((feature, index) => (
              <div key={index} className="flex items-center text-amber-200">
                <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                {feature}
              </div>
            ))}
          </div>

          <Link href="/register">
            <Button size="lg" className="bg-white text-amber-600 hover:bg-amber-50 text-lg px-10 py-6 shadow-2xl shadow-white/25 hover:shadow-white/40 transition-all duration-300 transform hover:scale-105 group font-bold">
              <Sparkles className="w-5 h-5 mr-3 text-amber-600 group-hover:rotate-180 transition-transform duration-500" />
              Get Started Now - It&apos;s Free!
              <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 py-8">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>© {currentYear} AIInterviewer. Helping job seekers land their dream roles.</p>
        </div>
      </footer>
    </div>
  );
}