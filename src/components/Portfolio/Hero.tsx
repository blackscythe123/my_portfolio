import { Button } from "@/components/ui/button";
import { Github, Instagram, Mail, MapPin } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-hero" />
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Simiyon Vinscent Samuel L
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-2">
            Computer Science & Engineering Student
          </p>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>Chennai, India</span>
          </div>
        </div>
        
        <p className="text-lg md:text-xl text-foreground/90 mb-8 max-w-3xl mx-auto leading-relaxed">
          A motivated and detail-oriented Computer Science professional beginning the journey in web development and ML. 
          Passionate about leveraging skills in machine learning, software development, and automation to contribute to 
          innovative solutions in LLM and intelligent agents.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Button size="lg" className="bg-gradient-primary hover:shadow-glow transition-all duration-300" onClick={() => {
            const element = document.getElementById('projects');
            if (element) element.scrollIntoView({ behavior: 'smooth' });
          }}>
            View My Work
          </Button>
          <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground" onClick={() => {
            const element = document.getElementById('contact');
            if (element) element.scrollIntoView({ behavior: 'smooth' });
          }}>
            Get In Touch
          </Button>
        </div>
        
        <div className="flex justify-center gap-6">
          <a 
            href="https://github.com/blackscythe123" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-3 rounded-full bg-card hover:bg-primary hover:text-primary-foreground transition-colors duration-300 hover:shadow-glow"
          >
            <Github className="w-6 h-6" />
          </a>
          <a 
            href="https://www.instagram.com/simiyon_sam.xx" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-3 rounded-full bg-card hover:bg-primary hover:text-primary-foreground transition-colors duration-300 hover:shadow-glow"
          >
            <Instagram className="w-6 h-6" />
          </a>
          <a 
            href="mailto:samsamuel@gmail.com"
            className="p-3 rounded-full bg-card hover:bg-primary hover:text-primary-foreground transition-colors duration-300 hover:shadow-glow"
          >
            <Mail className="w-6 h-6" />
          </a>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;