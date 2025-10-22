'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Clock, Users, Code, Database, Globe, Server, Cpu } from 'lucide-react';

// Define types for our templates
interface InterviewTemplate {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  level: string;
  duration: string;
  skills: string[];
  domains: string[];
}

interface CustomTemplateData {
  name: string;
  description: string;
  level: string;
  domains: string[];
  skills: string;
  duration: string;
}

// Pre-defined interview templates
const interviewTemplates: InterviewTemplate[] = [
  {
    id: 'fullstack',
    title: 'Full Stack Web Developer',
    description: 'Comprehensive interview covering frontend, backend, databases, and system design',
    icon: Globe,
    level: 'Intermediate',
    duration: '45-60 min',
    skills: ['React', 'Node.js', 'MongoDB', 'REST APIs', 'System Design'],
    domains: ['Frontend', 'Backend', 'Database', 'Architecture']
  },
  {
    id: 'frontend',
    title: 'Frontend Developer',
    description: 'Focus on modern frontend technologies, frameworks, and user experience',
    icon: Code,
    level: 'Intermediate',
    duration: '30-45 min',
    skills: ['React', 'JavaScript', 'CSS', 'TypeScript', 'State Management'],
    domains: ['Frontend', 'UI/UX', 'Performance']
  },
  {
    id: 'backend',
    title: 'Backend Engineer',
    description: 'Deep dive into server-side development, APIs, and system architecture',
    icon: Server,
    level: 'Advanced',
    duration: '45-60 min',
    skills: ['Node.js/Python/Java', 'REST/GraphQL', 'Database Design', 'Caching', 'Microservices'],
    domains: ['Backend', 'API Design', 'System Architecture']
  },
  {
    id: 'java',
    title: 'Java Developer',
    description: 'Java-specific interview covering core concepts, frameworks, and best practices',
    icon: Cpu,
    level: 'Intermediate',
    duration: '40-50 min',
    skills: ['Java Core', 'Spring Boot', 'Hibernate', 'Design Patterns', 'JVM'],
    domains: ['Java', 'Frameworks', 'OOP']
  },
  {
    id: 'mysql',
    title: 'MySQL Database Expert',
    description: 'Database design, optimization, and SQL query expertise assessment',
    icon: Database,
    level: 'Intermediate',
    duration: '35-50 min',
    skills: ['SQL Queries', 'Database Design', 'Indexing', 'Optimization', 'Transactions'],
    domains: ['Database', 'SQL', 'Performance']
  },
  {
    id: 'c-language',
    title: 'C Language Programmer',
    description: 'Low-level programming, memory management, and algorithm implementation',
    icon: Cpu,
    level: 'Advanced',
    duration: '40-55 min',
    skills: ['C Programming', 'Memory Management', 'Algorithms', 'Data Structures', 'System Programming'],
    domains: ['C Language', 'Algorithms', 'System Programming']
  }
];

const difficultyLevels = [
  { value: 'beginner', label: 'Beginner', description: 'Basic concepts and fundamentals' },
  { value: 'intermediate', label: 'Intermediate', description: 'Practical applications and problem-solving' },
  { value: 'advanced', label: 'Advanced', description: 'Complex scenarios and system design' }
];

const domainOptions = [
  'Frontend Development',
  'Backend Development',
  'Database Design',
  'System Architecture',
  'Algorithms',
  'Data Structures',
  'Object-Oriented Programming',
  'REST APIs',
  'GraphQL',
  'Microservices',
  'Testing',
  'DevOps',
  'Security',
  'Performance Optimization',
  'Mobile Development'
];

export default function NewInterviewPage() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [customTemplate, setCustomTemplate] = useState<CustomTemplateData>({
    name: '',
    description: '',
    level: 'intermediate',
    domains: [],
    skills: '',
    duration: '30'
  });
  const [isCustomDialogOpen, setIsCustomDialogOpen] = useState(false);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleCustomTemplateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would save the custom template and start the interview
    console.log('Custom template:', customTemplate);
    // For now, we'll just start an interview with the custom settings
    startInterview('custom', customTemplate);
  };

  const startInterview = (templateType: string, data?: CustomTemplateData) => {
    // Navigate to interview session with selected template
    if (templateType === 'custom') {
      router.push(`/dashboard/interview/session?template=custom&data=${encodeURIComponent(JSON.stringify(data))}`);
    } else {
      router.push(`/dashboard/interview/session?template=${templateType}`);
    }
  };

  const toggleDomain = (domain: string) => {
    setCustomTemplate(prev => ({
      ...prev,
      domains: prev.domains.includes(domain)
        ? prev.domains.filter(d => d !== domain)
        : [...prev.domains, domain]
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Start New Interview
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose from our pre-defined templates or create your own custom interview session
          </p>
        </div>

        {/* Template Selection */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Pre-defined Templates
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {interviewTemplates.map((template) => {
              const IconComponent = template.icon;
              return (
                <Card 
                  key={template.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedTemplate === template.id ? 'ring-2 ring-blue-500 border-blue-500' : ''
                  }`}
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <IconComponent className="h-8 w-8 text-blue-600" />
                      <Badge variant="secondary" className="capitalize">
                        {template.level}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{template.title}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        {template.duration}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {template.skills.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {template.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{template.skills.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Custom Template Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Custom Interview
          </h2>
          <Dialog open={isCustomDialogOpen} onOpenChange={setIsCustomDialogOpen}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Plus className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Create Custom Template
                  </h3>
                  <p className="text-gray-500 text-center">
                    Design your own interview with specific topics, difficulty level, and domains
                  </p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Custom Interview Template</DialogTitle>
                <DialogDescription>
                  Design a personalized interview session with your preferred topics and difficulty level.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCustomTemplateSubmit} className="space-y-6">
                {/* Template Name */}
                <div className="space-y-2">
                  <Label htmlFor="templateName">Template Name</Label>
                  <Input
                    id="templateName"
                    placeholder="e.g., Senior React Developer Interview"
                    value={customTemplate.name}
                    onChange={(e) => setCustomTemplate(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what this interview will cover..."
                    value={customTemplate.description}
                    onChange={(e) => setCustomTemplate(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>

                {/* Difficulty Level */}
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <Select
                    value={customTemplate.level}
                    onValueChange={(value) => setCustomTemplate(prev => ({ ...prev, level: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty level" />
                    </SelectTrigger>
                    <SelectContent>
                      {difficultyLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          <div className="flex items-center">
                            <span className="capitalize">{level.label}</span>
                            <span className="text-gray-500 text-sm ml-2">- {level.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <Label htmlFor="duration">Interview Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="15"
                    max="120"
                    value={customTemplate.duration}
                    onChange={(e) => setCustomTemplate(prev => ({ ...prev, duration: e.target.value }))}
                    required
                  />
                </div>

                {/* Domains */}
                <div className="space-y-2">
                  <Label>Select Domains to Include</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 border rounded-md">
                    {domainOptions.map((domain) => (
                      <div key={domain} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`domain-${domain}`}
                          checked={customTemplate.domains.includes(domain)}
                          onChange={() => toggleDomain(domain)}
                          className="rounded border-gray-300"
                        />
                        <label htmlFor={`domain-${domain}`} className="text-sm cursor-pointer">
                          {domain}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Specific Skills */}
                <div className="space-y-2">
                  <Label htmlFor="skills">Specific Skills/Topics (comma-separated)</Label>
                  <Input
                    id="skills"
                    placeholder="e.g., React Hooks, Node.js, MongoDB, REST APIs"
                    value={customTemplate.skills}
                    onChange={(e) => setCustomTemplate(prev => ({ ...prev, skills: e.target.value }))}
                  />
                  <p className="text-sm text-gray-500">
                    List specific technologies, frameworks, or concepts you want to be tested on
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCustomDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    Start Custom Interview
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Start Interview Button */}
        {selectedTemplate && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2">
            <Button
              size="lg"
              onClick={() => startInterview(selectedTemplate)}
              className="shadow-lg"
            >
              <Users className="mr-2 h-5 w-5" />
              Start {interviewTemplates.find(t => t.id === selectedTemplate)?.title} Interview
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}