import Hero from "@/components/Portfolio/Hero";
import Navigation from "@/components/Portfolio/Navigation";
import Education from "@/components/Portfolio/Education";  
import Skills from "@/components/Portfolio/Skills";
import Projects from "@/components/Portfolio/Projects";
import Repositories from "@/components/Portfolio/Repositories";
import Contact from "@/components/Portfolio/Contact";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <div id="hero">
        <Hero />
      </div>
      <div id="education">
        <Education />
      </div>
      <div id="skills">
        <Skills />
      </div>
      <div id="projects">
        <Projects />
      </div>
      <div id="repositories">
        <Repositories />
      </div>
      <div id="contact">
        <Contact />
      </div>
    </div>
  );
};

export default Index;
