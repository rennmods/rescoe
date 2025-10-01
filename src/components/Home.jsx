import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Home as HomeIcon, User } from "lucide-react";
import backgroundImage from "../assets/bg.jpg"; // pastikan ada di src/assets/bg.jpg

const Home = ({ className }) => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    AOS.refresh();
  }, []);

  return (
    <header
      className="relative w-full h-screen bg-cover bg-center flex flex-col justify-center items-center text-center px-6 bg-gray-900"
      style={{ backgroundImage: `url(${backgroundImage})` }}
      id="home"
    >
      {/* Overlay gelap */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 via-gray-900/80 to-gray-900"></div>

      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full px-6 py-4 z-20 flex justify-between items-center">
        <div className="bg-white/10 p-2 rounded-full backdrop-blur-sm shadow-md cursor-pointer">
          <HomeIcon size={22} className="text-white" />
        </div>
        <div className="flex items-center space-x-2 text-white text-sm sm:text-base font-medium">
          <span>Hi, Visitor!</span>
          <div className="bg-white/10 p-2 rounded-full backdrop-blur-sm shadow-md cursor-pointer">
            <User size={22} className="text-white" />
          </div>
        </div>
      </nav>

      {/* Konten Welcome */}
      <div className="relative z-10 space-y-3" data-aos="fade-up">
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-wide">
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent text-glow">
            WELCOME
          </span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-cyan-300 tracking-wider uppercase drop-shadow">
          To {className}
        </p>
      </div>

      {/* Tombol scroll */}
      <a href="#content" className="absolute bottom-10 z-10 animate-bounce">
        <svg
          className="w-6 sm:w-8 h-6 sm:h-8 text-cyan-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </a>
    </header>
  );
};

export default Home;
