import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Github, Instagram, MapPin, Globe } from "lucide-react";

const Contact = () => {
  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "samsamuel@gmail.com",
      href: "mailto:samsamuel@gmail.com"
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Chennai, India",
      href: null
    },
    {
      icon: Globe,
      label: "Languages",
      value: "English, Tamil",
      href: null
    }
  ];

  const socialLinks = [
    {
      icon: Github,
      label: "GitHub",
      href: "https://github.com/blackscythe123",
      color: "hover:bg-gray-800"
    },
    {
      icon: Instagram,
      label: "Instagram", 
      href: "https://www.instagram.com/simiyon_sam.xx",
      color: "hover:bg-pink-600"
    },
    {
      icon: Globe,
      label: "CodinGame",
      href: "https://www.codingame.com/profile/e4caa9e7f2070da34809b8c0a710ca4d3153376",
      color: "hover:bg-blue-600"
    }
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Let's Connect
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ready to collaborate on exciting projects or discuss opportunities in ML and web development
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <Card className="bg-card border-border shadow-card">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6">Get In Touch</h3>
              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="p-2 bg-gradient-primary rounded-lg">
                      <item.icon className="w-5 h-5 text-background" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{item.label}</div>
                      {item.href ? (
                        <a 
                          href={item.href}
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <div className="text-muted-foreground">{item.value}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <Button 
                  asChild
                  className="w-full bg-gradient-primary hover:shadow-glow"
                >
                  <a href="mailto:samsamuel@gmail.com">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Email
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card className="bg-gradient-secondary border-primary/20 shadow-card">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6">Follow Me</h3>
              <p className="text-muted-foreground mb-8">
                Connect with me on social platforms to stay updated with my latest projects and insights.
              </p>
              
              <div className="space-y-4">
                {socialLinks.map((social, index) => (
                  <Button
                    key={index}
                    asChild
                    variant="outline"
                    className="w-full justify-start border-primary/50 hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                  >
                    <a 
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <social.icon className="w-5 h-5 mr-3" />
                      {social.label}
                    </a>
                  </Button>
                ))}
              </div>

              <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Interested in <span className="text-primary font-medium">Machine Learning</span>, 
                  <span className="text-primary font-medium"> AI Agents</span>, and 
                  <span className="text-primary font-medium"> Web Development</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;