import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Home as HomeIcon, User, Sparkles } from "lucide-react";
import backgroundImage from "../assets/bg.jpg";

const Home = ({ className }) => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    AOS.refresh();
  }, []);

  return (
    <header
      className="relative w-full h-screen bg-cover bg-center flex flex-col justify-center items-center text-center px-6 bg-gray-900 overflow-hidden"
      style={{ backgroundImage: `url(${backgroundImage})` }}
      id="home"
    >
      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-blue-900/30 to-cyan-900/20 animate-gradient-x"></div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(25)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-2 h-2 bg-cyan-400 rounded-full opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${15 + Math.random() * 20}s`
            }}
          />
        ))}
      </div>

      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full px-6 py-4 z-20 flex justify-between items-center">
        <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm shadow-lg border border-white/10 hover:bg-white/20 transition-all duration-300 cursor-pointer hover:scale-105 group">
          <HomeIcon size={22} className="text-white group-hover:text-cyan-300 transition-colors" />
        </div>
        <div className="flex items-center space-x-3 text-white text-sm sm:text-base font-medium">
          <span className="bg-white/10 px-3 py-2 rounded-2xl backdrop-blur-sm">Hi, Visitor! 👋</span>
          <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm shadow-lg border border-white/10 hover:bg-white/20 transition-all duration-300 cursor-pointer hover:scale-105 group">
            <User size={22} className="text-white group-hover:text-cyan-300 transition-colors" />
          </div>
        </div>
      </nav>

      {/* Konten Welcome dengan Glow Effect */}
      <div className="relative z-10 space-y-6" data-aos="fade-up" data-aos-delay="200">
        <div className="flex justify-center items-center space-x-3 mb-4">
          <Sparkles className="text-cyan-400 animate-pulse" size={32} />
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-wide">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-text-glow">
              WELCOME
            </span>
          </h1>
          <Sparkles className="text-cyan-400 animate-pulse" size={32} />
        </div>
        
        <div className="space-y-2">
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-cyan-300 tracking-wider uppercase drop-shadow-lg animate-pulse-slow">
            To {className}
          </p>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Where learning meets innovation ✨ | Connect • Create • Collaborate
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6" data-aos="fade-up" data-aos-delay="400">
          <button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3 px-8 rounded-2xl shadow-lg hover:shadow-cyan-500/25 hover:scale-105 transition-all duration-300 flex items-center space-x-2 group">
            <span>Explore Our World</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
          <button className="border-2 border-cyan-400 text-cyan-400 font-bold py-3 px-8 rounded-2xl hover:bg-cyan-400 hover:text-gray-900 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
            Meet The Crew
          </button>
        </div>
      </div>

      {/* Scroll Indicator dengan Animation */}
      <a href="#content" className="absolute bottom-8 z-10 animate-bounce-slow group">
        <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-all duration-300">
          <svg className="w-6 sm:w-8 h-6 sm:h-8 text-cyan-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
          </svg>
        </div>
        <p className="text-xs text-cyan-300 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Explore More
        </p>
      </a>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-900 to-transparent"></div>
    </header>
  );
};

export default Home;
