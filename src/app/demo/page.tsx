'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Play, User, FileText, Mic, Star, Download, Sparkles, Crown, CheckCircle, ArrowRight } from 'lucide-react';

// Particle component that only renders on client
function FloatingParticles() {
  const [particles, setParticles] = useState<Array<{ left: string; top: string; delay: string; duration: string }>>([]);

  useEffect(() => {
    const generatedParticles = [...Array(15)].map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${10 + Math.random() * 10}s`
    }));
    setParticles(generatedParticles);
  }, []);

  if (particles.length === 0) {
    return null;
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

// Flow Step Component
function FlowStep({ number, title, description, icon, isActive, isCompleted }: {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  isActive: boolean;
  isCompleted: boolean;
}) {
  return (
    <div className={`flex items-start space-x-4 p-6 rounded-2xl transition-all duration-300 ${
      isActive 
        ? 'bg-gradient-to-r from-amber-500/20 to-blue-500/20 border-2 border-amber-400/50 shadow-lg shadow-amber-500/25' 
        : isCompleted
        ? 'bg-white/10 border border-white/10'
        : 'bg-white/5 border border-white/5 opacity-60'
    }`}>
      <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
        isActive 
          ? 'bg-gradient-to-r from-amber-500 to-blue-600 shadow-lg shadow-amber-500/25' 
          : isCompleted
          ? 'bg-green-500 shadow-lg shadow-green-500/25'
          : 'bg-white/10'
      }`}>
        {isCompleted ? (
          <CheckCircle className="w-6 h-6 text-white" />
        ) : (
          <span className={`text-lg font-bold ${isActive ? 'text-white' : 'text-gray-300'}`}>
            {number}
          </span>
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center space-x-3 mb-2">
          <div className={`${isActive ? 'text-amber-300' : isCompleted ? 'text-green-300' : 'text-gray-400'}`}>
            {icon}
          </div>
          <h3 className={`text-xl font-semibold ${isActive ? 'text-amber-300' : isCompleted ? 'text-green-300' : 'text-gray-400'}`}>
            {title}
          </h3>
        </div>
        <p className="text-gray-300 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

export default function DemoPage() {
  const [currentStep, setCurrentStep] = useState(0);

  const flowSteps = [
    {
      number: 1,
      title: "Sign Up & Create Profile",
      description: "Quick registration process where you set up your profile, specify your target roles, and upload your resume for personalized interview preparation.",
      icon: <User className="w-6 h-6" />
    },
    {
      number: 2,
      title: "Choose Interview Domain",
      description: "Select from various domains like Frontend, Backend, Full Stack, Data Science, or specify your custom requirements for targeted practice.",
      icon: <FileText className="w-6 h-6" />
    },
    {
      number: 3,
      title: "Set Difficulty Level",
      description: "Choose your comfort level - Beginner for fundamentals, Intermediate for role-specific questions, or Advanced for senior/leadership positions.",
      icon: <Star className="w-6 h-6" />
    },
    {
      number: 4,
      title: "Start AI Interview",
      description: "Engage in realistic voice-based conversation with our AI interviewer. Ask questions, provide answers, and receive real-time interaction.",
      icon: <Mic className="w-6 h-6" />
    },
    {
      number: 5,
      title: "Get Detailed Feedback",
      description: "Receive comprehensive analysis including communication skills, technical knowledge, problem-solving approach, and personalized improvement suggestions.",
      icon: <Download className="w-6 h-6" />
    },
    {
      number: 6,
      title: "Track Progress & Improve",
      description: "Monitor your improvement over time with detailed analytics, track scores across different domains, and focus on areas that need attention.",
      icon: <Sparkles className="w-6 h-6" />
    }
  ];

  const nextStep = () => {
    if (currentStep < flowSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

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
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="relative">
                <Crown className="h-10 w-10 text-amber-400" />
                <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-amber-200" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-blue-400 bg-clip-text text-transparent">
                AIInterviewer
              </span>
            </Link>
          </div>
          <div className="flex space-x-3">
            <Link href="/">
              <Button variant="ghost" className="text-white hover:text-amber-300 hover:bg-white/10 border border-transparent hover:border-amber-400/30 transition-all duration-300">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
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

      {/* Main Demo Content */}
      <div className="relative container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-amber-400/30 mb-6">
              <Play className="w-4 h-4 text-amber-300 mr-2 fill-current" />
              <span className="text-amber-300 font-medium">How It Works</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-amber-200 to-blue-200 bg-clip-text text-transparent">
                User Journey
              </span>
              <br />
              <span className="bg-gradient-to-r from-amber-400 to-blue-500 bg-clip-text text-transparent">
                Demo
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Follow the step-by-step flow to understand how AIInterviewer helps you prepare for your dream job interview.
            </p>
          </div>

          {/* Flow Steps */}
          <div className="space-y-6 mb-8">
            {flowSteps.map((step, index) => (
              <FlowStep
                key={index}
                number={step.number}
                title={step.title}
                description={step.description}
                icon={step.icon}
                isActive={index === currentStep}
                isCompleted={index < currentStep}
              />
            ))}
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center">
            <Button
              onClick={prevStep}
              disabled={currentStep === 0}
              variant="outline"
              className="border-2 border-amber-400/50 text-amber-300 hover:bg-amber-400/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous Step
            </Button>

            <div className="flex items-center space-x-2">
              {flowSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? 'bg-amber-400 scale-125'
                      : index < currentStep
                      ? 'bg-green-400'
                      : 'bg-white/30'
                  }`}
                />
              ))}
            </div>

            {currentStep < flowSteps.length - 1 ? (
              <Button
                onClick={nextStep}
                className="bg-gradient-to-r from-amber-500 to-blue-600 hover:from-amber-600 hover:to-blue-700 text-white shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-300 transform hover:scale-105 group"
              >
                Next Step
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            ) : (
              <Link href="/register">
                <Button className="bg-gradient-to-r from-amber-500 to-blue-600 hover:from-amber-600 hover:to-blue-700 text-white shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-300 transform hover:scale-105 group">
                  <Sparkles className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                  Start Your Journey
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
            )}
          </div>

          {/* Current Step Preview */}
          <Card className="mt-12 bg-white/5 backdrop-blur-sm border-white/10 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white text-2xl flex items-center">
                <Sparkles className="w-6 h-6 mr-3 text-amber-400" />
                Step {currentStep + 1}: {flowSteps[currentStep].title}
              </CardTitle>
              <CardDescription className="text-gray-300 text-lg">
                {flowSteps[currentStep].description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="text-center text-gray-400">
                  <p>This is where the actual {flowSteps[currentStep].title.toLowerCase()} interface would appear.</p>
                  <p className="text-sm mt-2">In the full application, you would interact with this step directly.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}