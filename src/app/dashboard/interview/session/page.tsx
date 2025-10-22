'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, Square } from 'lucide-react';

// Define types for interview data
interface InterviewTemplateData {
  title: string;
  description: string;
  level: string;
  skills: string[];
  isCustom?: boolean;
}

interface CustomTemplateData {
  name: string;
  description: string;
  level: string;
  skills: string;
}

// Mock interview templates data
const interviewTemplates: Record<string, InterviewTemplateData> = {
  fullstack: {
    title: 'Full Stack Web Developer',
    description: 'Comprehensive interview covering frontend, backend, databases, and system design',
    level: 'Intermediate',
    skills: ['React', 'Node.js', 'MongoDB', 'REST APIs', 'System Design']
  },
  frontend: {
    title: 'Frontend Developer',
    description: 'Focus on modern frontend technologies, frameworks, and user experience',
    level: 'Intermediate',
    skills: ['React', 'JavaScript', 'CSS', 'TypeScript', 'State Management']
  },
  backend: {
    title: 'Backend Engineer',
    description: 'Deep dive into server-side development, APIs, and system architecture',
    level: 'Advanced',
    skills: ['Node.js/Python/Java', 'REST/GraphQL', 'Database Design', 'Caching', 'Microservices']
  },
  java: {
    title: 'Java Developer',
    description: 'Java-specific interview covering core concepts, frameworks, and best practices',
    level: 'Intermediate',
    skills: ['Java Core', 'Spring Boot', 'Hibernate', 'Design Patterns', 'JVM']
  },
  mysql: {
    title: 'MySQL Database Expert',
    description: 'Database design, optimization, and SQL query expertise assessment',
    level: 'Intermediate',
    skills: ['SQL Queries', 'Database Design', 'Indexing', 'Optimization', 'Transactions']
  },
  'c-language': {
    title: 'C Language Programmer',
    description: 'Low-level programming, memory management, and algorithm implementation',
    level: 'Advanced',
    skills: ['C Programming', 'Memory Management', 'Algorithms', 'Data Structures', 'System Programming']
  }
};

export default function InterviewSessionPage() {
  const searchParams = useSearchParams();
  const template = searchParams.get('template');
  const customData = searchParams.get('data');
  
  const [isRecording, setIsRecording] = useState(false);
  const [interviewData, setInterviewData] = useState<InterviewTemplateData | null>(null);

  useEffect(() => {
    if (template === 'custom' && customData) {
      try {
        const data: CustomTemplateData = JSON.parse(decodeURIComponent(customData));
        setInterviewData({
          title: data.name,
          description: data.description,
          level: data.level,
          skills: data.skills.split(',').map((s: string) => s.trim()),
          isCustom: true
        });
      } catch (error) {
        console.error('Error parsing custom data:', error);
      }
    } else if (template && interviewTemplates[template]) {
      setInterviewData(interviewTemplates[template]);
    }
  }, [template, customData]);

  const startRecording = () => {
    setIsRecording(true);
    // TODO: Implement voice recording and AI interview start
  };

  const stopRecording = () => {
    setIsRecording(false);
    // TODO: Implement stop recording
  };

  if (!interviewData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Loading Interview...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Interview Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {interviewData.title}
            {interviewData.isCustom && (
              <Badge variant="secondary" className="ml-2">
                Custom
              </Badge>
            )}
          </h1>
          <p className="text-gray-600 text-lg">{interviewData.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Interview Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Interview Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm text-gray-700">Difficulty Level</h4>
                  <Badge className="capitalize mt-1">{interviewData.level}</Badge>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-700">Skills Covered</h4>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {interviewData.skills.map((skill: string) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Instructions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-600">
                <p>• Speak clearly and naturally</p>
                <p>• Think aloud while solving problems</p>
                <p>• Ask for clarification if needed</p>
                <p>• This is a practice session - relax and learn</p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Interview Interface */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Interview Session</CardTitle>
                <CardDescription>
                  The AI interviewer will ask you questions based on your selected template
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-12 space-y-8">
                {/* AI Interviewer Avatar/Placeholder */}
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  AI
                </div>

                {/* Recording Status */}
                <div className="text-center">
                  {isRecording ? (
                    <div className="flex items-center justify-center space-x-2 text-red-600">
                      <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                      <span className="font-semibold">Recording in progress...</span>
                    </div>
                  ) : (
                    <div className="text-gray-600">
                      Ready to start the interview
                    </div>
                  )}
                </div>

                {/* Control Buttons */}
                <div className="flex gap-4">
                  {!isRecording ? (
                    <Button 
                      size="lg" 
                      onClick={startRecording}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Mic className="mr-2 h-5 w-5" />
                      Start Interview
                    </Button>
                  ) : (
                    <Button 
                      size="lg" 
                      variant="destructive"
                      onClick={stopRecording}
                    >
                      <Square className="mr-2 h-5 w-5" />
                      End Interview
                    </Button>
                  )}
                </div>

                {/* Transcript Placeholder */}
                <div className="w-full max-w-2xl">
                  <div className="bg-gray-50 rounded-lg p-4 min-h-[200px]">
                    <p className="text-gray-500 text-center">
                      {isRecording 
                        ? "AI interviewer questions and your responses will appear here..." 
                        : "Press 'Start Interview' to begin your practice session"
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}