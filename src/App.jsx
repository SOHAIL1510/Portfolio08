import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ThreeDBackground from "./components/ThreeDBackground";
import VoiceAgent from "./components/VoiceAgent";

export default function App() {
  return (
    <div className="relative text-white min-h-screen overflow-x-hidden">
      <ThreeDBackground />
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
        <Footer />
        <VoiceAgent />
      </div>
    </div>
  );
}
