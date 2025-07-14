import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, MapPin, Calendar, BookOpen } from "lucide-react";

const Education = () => {
  const coursework = ["DSA in Unstop", "Flutter", "Java (W3Schools)"];
  
  return (
    <section className="py-20 px-6 bg-gradient-secondary">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Education
          </h2>
          <p className="text-xl text-muted-foreground">
            Building a strong foundation in computer science
          </p>
        </div>

        <Card className="bg-card border-primary/20 shadow-card hover:shadow-glow transition-all duration-300">
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-primary rounded-lg">
                <GraduationCap className="w-8 h-8 text-background" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2">
                  Integrated M.Tech in Computer Science and Engineering
                </CardTitle>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <BookOpen className="w-4 h-4" />
                    <span className="font-medium">Sri Sivasubramaniya Nadar College of Engineering</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>Chennai, India</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>2024 – 2029</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary">8.125</div>
                <div className="text-sm text-muted-foreground">/ 10 GPA</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div>
              <h4 className="font-semibold mb-3 text-lg">Relevant Coursework & Certifications</h4>
              <div className="flex flex-wrap gap-2">
                {coursework.map((course) => (
                  <Badge 
                    key={course} 
                    variant="outline" 
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {course}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Card className="inline-block bg-gradient-primary p-6">
            <div className="text-background">
              <div className="text-2xl font-bold">🏆</div>
              <div className="font-semibold">Achievement</div>
              <div className="text-sm opacity-90">Completed first year of Integrated M.Tech CSE successfully</div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Education;