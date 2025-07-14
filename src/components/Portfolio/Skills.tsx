import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code, Database, Wrench, Brain } from "lucide-react";

const Skills = () => {
  const skillCategories = [
    {
      title: "Programming Languages",
      icon: Code,
      skills: ["Python", "JavaScript", "C++", "C", "Dart"],
      color: "bg-gradient-primary"
    },
    {
      title: "Frameworks & Libraries",
      icon: Database,
      skills: ["OpenCV", "React", "Flask"],
      color: "bg-gradient-secondary"
    },
    {
      title: "Tools & Technologies",
      icon: Wrench,
      skills: ["Git", "LaTeX", "VS Code"],
      color: "bg-gradient-primary"
    },
    {
      title: "Core Concepts",
      icon: Brain,
      skills: ["Data Structures", "Computer Vision", "Data Analysis", "Web Development"],
      color: "bg-gradient-secondary"
    }
  ];

  const fieldsOfInterest = ["Machine Learning", "AI Agents", "Automations", "Flutter App Development", "Deep Research"];

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Skills & Expertise
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A comprehensive toolkit for building innovative solutions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {skillCategories.map((category, index) => (
            <Card key={index} className="bg-card border-border hover:shadow-card transition-all duration-300 hover:scale-105">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${category.color}`}>
                    <category.icon className="w-5 h-5 text-background" />
                  </div>
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <Badge 
                      key={skill} 
                      variant="secondary" 
                      className="bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-gradient-secondary border-primary/20">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Fields of Interest
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap justify-center gap-4">
              {fieldsOfInterest.map((interest) => (
                <Badge 
                  key={interest} 
                  className="bg-primary text-primary-foreground text-lg py-2 px-4 hover:shadow-glow transition-all duration-300"
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Skills;