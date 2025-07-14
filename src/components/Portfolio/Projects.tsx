import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ExternalLink, Code } from "lucide-react";

const Projects = () => {
  const projects = [
    {
      name: "SkyWings: Full-Stack Flight Booking System",
      date: "May 2025",
      description: "Comprehensive flight booking platform with AI chatbot, payment gateway, weather info, and full-stack architecture.",
      tech: ["Flask", "SQLAlchemy", "Bootstrap", "Stripe API", "OpenWeather API"],
      highlight: true
    },
    {
      name: "FoodExpress: Food Ordering Web App",
      date: "April 2025",
      description: "Responsive food ordering system with menus, user accounts, and modern frontend/backend stack.",
      tech: ["React", "Node.js", "Express", "MongoDB"]
    },
    {
      name: "Bunk: Academic Management Mobile App",
      date: "April 2025",
      description: "Flutter mobile app for attendance tracking and study session organization with beautiful UI/UX.",
      tech: ["Flutter", "Dart", "fl_chart", "wave", "shared_preferences"]
    },
    {
      name: "StudentTrackPro: Attendance System",
      date: "April 2025",
      description: "Web-based app for attendance management, with email notifications and detailed reports.",
      tech: ["Flask", "SQLAlchemy", "Bootstrap", "Flask-Mail"]
    },
    {
      name: "Hutloo: Logistics Optimization Platform",
      date: "April 2025",
      description: "Real-time logistics tracker using geospatial visualization and simple Flask-based backend.",
      tech: ["Flask", "Bootstrap", "Leaflet", "SQLite", "Gunicorn"]
    }
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Innovative solutions showcasing full-stack development and problem-solving skills
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <Card 
              key={index} 
              className={`bg-card border-border hover:shadow-card transition-all duration-300 hover:scale-105 ${
                project.highlight ? 'ring-2 ring-primary' : ''
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg leading-tight">
                    {project.name}
                  </CardTitle>
                  {project.highlight && (
                    <Badge className="bg-gradient-primary text-background">
                      Featured
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{project.date}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {project.tech.map((tech) => (
                    <Badge 
                      key={tech} 
                      variant="secondary" 
                      className="text-xs bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="flex-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <Code className="w-4 h-4 mr-2" />
                    View Code
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-gradient-primary hover:shadow-glow"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;