
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Download, User, Briefcase, Mail, Phone, MapPin, Globe, Github, Linkedin, Plus, X, Printer, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { handlePrint, downloadAsImage } from '@/utils/printUtils';

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  link?: string;
}

interface Skill {
  id: string;
  name: string;
  level: number;
}

const PortfolioGenerator = () => {
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    github: '',
    linkedin: '',
    summary: '',
    template: 'modern' as 'modern' | 'classic' | 'creative'
  });

  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newProject, setNewProject] = useState({ title: '', description: '', technologies: '', link: '' });
  const [newSkill, setNewSkill] = useState({ name: '', level: 50 });

  const { toast } = useToast();

  const loadSampleData = () => {
    setFormData({
      name: 'Alex Johnson',
      title: 'Full Stack Developer',
      email: 'alex.johnson@email.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      website: 'https://alexjohnson.dev',
      github: 'github.com/alexjohnson',
      linkedin: 'linkedin.com/in/alexjohnson',
      summary: 'Passionate full-stack developer with 5+ years of experience building scalable web applications. Expertise in React, Node.js, and cloud technologies. Strong problem-solving skills and a commitment to writing clean, maintainable code.',
      template: 'modern'
    });

    const sampleProjects: Project[] = [
      {
        id: '1',
        title: 'E-Commerce Platform',
        description: 'Built a full-featured e-commerce platform with user authentication, payment processing, and admin dashboard. Implemented real-time inventory management and order tracking.',
        technologies: ['React', 'Node.js', 'MongoDB', 'Stripe', 'AWS'],
        link: 'https://github.com/alexjohnson/ecommerce-platform'
      },
      {
        id: '2',
        title: 'Task Management App',
        description: 'Developed a collaborative task management application with real-time updates, file sharing, and team collaboration features. Used WebSocket for live updates.',
        technologies: ['Vue.js', 'Express.js', 'PostgreSQL', 'Socket.io', 'Docker'],
        link: 'https://taskmanager-demo.com'
      },
      {
        id: '3',
        title: 'Weather Dashboard',
        description: 'Created a responsive weather dashboard that displays current weather and 7-day forecasts for multiple cities. Integrated with external weather APIs and implemented data visualization.',
        technologies: ['React', 'TypeScript', 'Chart.js', 'OpenWeather API', 'Tailwind CSS'],
        link: 'https://weather-dashboard-demo.com'
      }
    ];

    const sampleSkills: Skill[] = [
      { id: '1', name: 'JavaScript', level: 95 },
      { id: '2', name: 'React', level: 90 },
      { id: '3', name: 'Node.js', level: 85 },
      { id: '4', name: 'TypeScript', level: 80 },
      { id: '5', name: 'Python', level: 75 },
      { id: '6', name: 'AWS', level: 70 },
      { id: '7', name: 'Docker', level: 65 },
      { id: '8', name: 'MongoDB', level: 80 }
    ];

    setProjects(sampleProjects);
    setSkills(sampleSkills);

    toast({
      title: "Sample Data Loaded",
      description: "Portfolio filled with sample data. You can now edit or use as is!",
    });
  };

  const clearData = () => {
    setFormData({
      name: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      github: '',
      linkedin: '',
      summary: '',
      template: 'modern'
    });
    setProjects([]);
    setSkills([]);
    setNewProject({ title: '', description: '', technologies: '', link: '' });
    setNewSkill({ name: '', level: 50 });

    toast({
      title: "Data Cleared",
      description: "All fields have been reset. Start fresh!",
    });
  };

  const addProject = () => {
    if (newProject.title && newProject.description) {
      const project: Project = {
        id: Date.now().toString(),
        title: newProject.title,
        description: newProject.description,
        technologies: newProject.technologies.split(',').map(t => t.trim()),
        link: newProject.link || undefined
      };
      setProjects([...projects, project]);
      setNewProject({ title: '', description: '', technologies: '', link: '' });
    }
  };

  const addSkill = () => {
    if (newSkill.name) {
      const skill: Skill = {
        id: Date.now().toString(),
        name: newSkill.name,
        level: newSkill.level
      };
      setSkills([...skills, skill]);
      setNewSkill({ name: '', level: 50 });
    }
  };

  const removeProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  const removeSkill = (id: string) => {
    setSkills(skills.filter(s => s.id !== id));
  };

  const handlePrintPortfolio = () => {
    handlePrint('portfolio-preview');
    toast({
      title: "Print Started",
      description: "Your portfolio is being prepared for printing...",
    });
  };

  const handleDownloadPortfolio = async () => {
    await downloadAsImage('portfolio-preview', 'portfolio');
    toast({
      title: "Download Started",
      description: "Your portfolio is being downloaded as an image...",
    });
  };

  const getTemplateStyles = () => {
    switch (formData.template) {
      case 'classic':
        return 'bg-gray-50 text-gray-800 font-serif';
      case 'creative':
        return 'bg-gradient-to-br from-purple-50 to-blue-50 text-gray-800';
      default:
        return 'bg-white text-gray-900';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <User className="h-10 w-10 text-blue-600" />
            Portfolio Generator
          </h1>
          <p className="text-xl text-gray-600">Create professional portfolios with ease</p>
          
          <div className="flex justify-center gap-4 mt-6">
            <Button onClick={loadSampleData} variant="outline" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Load Sample Data
            </Button>
            <Button onClick={clearData} variant="outline">
              Clear All Data
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <Label htmlFor="title">Professional Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="Software Developer"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      placeholder="San Francisco, CA"
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => setFormData({...formData, website: e.target.value})}
                      placeholder="https://johndoe.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="github">GitHub</Label>
                    <Input
                      id="github"
                      value={formData.github}
                      onChange={(e) => setFormData({...formData, github: e.target.value})}
                      placeholder="github.com/johndoe"
                    />
                  </div>
                  <div>
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      value={formData.linkedin}
                      onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                      placeholder="linkedin.com/in/johndoe"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="summary">Professional Summary</Label>
                  <Textarea
                    id="summary"
                    rows={4}
                    value={formData.summary}
                    onChange={(e) => setFormData({...formData, summary: e.target.value})}
                    placeholder="Brief description of your experience and goals..."
                  />
                </div>

                <div>
                  <Label htmlFor="template">Template Style</Label>
                  <select
                    id="template"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={formData.template}
                    onChange={(e) => setFormData({...formData, template: e.target.value as any})}
                  >
                    <option value="modern">Modern</option>
                    <option value="classic">Classic</option>
                    <option value="creative">Creative</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Projects Section */}
            <Card>
              <CardHeader>
                <CardTitle>Projects</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Input
                    placeholder="Project Title"
                    value={newProject.title}
                    onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                  />
                  <Textarea
                    placeholder="Project Description"
                    value={newProject.description}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  />
                  <Input
                    placeholder="Technologies (comma separated)"
                    value={newProject.technologies}
                    onChange={(e) => setNewProject({...newProject, technologies: e.target.value})}
                  />
                  <Input
                    placeholder="Project Link (optional)"
                    value={newProject.link}
                    onChange={(e) => setNewProject({...newProject, link: e.target.value})}
                  />
                  <Button onClick={addProject} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Project
                  </Button>
                </div>

                <div className="space-y-2">
                  {projects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold">{project.title}</h4>
                        <p className="text-sm text-gray-600">{project.description}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeProject(project.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Skills Section */}
            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Input
                    placeholder="Skill Name"
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                  />
                  <div>
                    <Label>Proficiency Level: {newSkill.level}%</Label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={newSkill.level}
                      onChange={(e) => setNewSkill({...newSkill, level: parseInt(e.target.value)})}
                      className="w-full"
                    />
                  </div>
                  <Button onClick={addSkill} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Skill
                  </Button>
                </div>

                <div className="space-y-2">
                  {skills.map((skill) => (
                    <div key={skill.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">{skill.name}</span>
                          <span className="text-sm text-gray-500">{skill.level}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${skill.level}%` }}
                          ></div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSkill(skill.id)}
                        className="ml-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button onClick={handleDownloadPortfolio} className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download Portfolio
              </Button>
              <Button onClick={handlePrintPortfolio} variant="outline">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
          </div>

          {/* Preview Section */}
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div id="portfolio-preview" className={`p-6 rounded-lg shadow-lg ${getTemplateStyles()} min-h-[600px] print:shadow-none print:bg-white`}>
                {/* Header */}
                <div className="text-center mb-6">
                  <h1 className="text-3xl font-bold mb-2">{formData.name || 'Your Name'}</h1>
                  <h2 className="text-xl text-gray-600 mb-4">{formData.title || 'Your Title'}</h2>
                  
                  <div className="flex flex-wrap justify-center gap-4 text-sm">
                    {formData.email && (
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {formData.email}
                      </div>
                    )}
                    {formData.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {formData.phone}
                      </div>
                    )}
                    {formData.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {formData.location}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap justify-center gap-4 mt-2 text-sm">
                    {formData.website && (
                      <div className="flex items-center gap-1">
                        <Globe className="h-4 w-4" />
                        {formData.website}
                      </div>
                    )}
                    {formData.github && (
                      <div className="flex items-center gap-1">
                        <Github className="h-4 w-4" />
                        {formData.github}
                      </div>
                    )}
                    {formData.linkedin && (
                      <div className="flex items-center gap-1">
                        <Linkedin className="h-4 w-4" />
                        {formData.linkedin}
                      </div>
                    )}
                  </div>
                </div>

                {/* Summary */}
                {formData.summary && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Professional Summary</h3>
                    <p className="text-gray-700 leading-relaxed">{formData.summary}</p>
                  </div>
                )}

                {/* Skills */}
                {skills.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Skills</h3>
                    <div className="space-y-3">
                      {skills.map((skill) => (
                        <div key={skill.id}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium">{skill.name}</span>
                            <span className="text-sm text-gray-500">{skill.level}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${skill.level}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Projects */}
                {projects.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Projects</h3>
                    <div className="space-y-4">
                      {projects.map((project) => (
                        <div key={project.id} className="border-l-4 border-blue-600 pl-4">
                          <h4 className="font-semibold text-lg">{project.title}</h4>
                          <p className="text-gray-700 mb-2">{project.description}</p>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {project.technologies.map((tech, index) => (
                              <Badge key={index} variant="secondary">{tech}</Badge>
                            ))}
                          </div>
                          {project.link && (
                            <p className="text-blue-600 text-sm">{project.link}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <style>
        {`
          @media print {
            .print\\:shadow-none {
              box-shadow: none !important;
            }
            .print\\:bg-white {
              background: white !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default PortfolioGenerator;
