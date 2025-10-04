import React from 'react';
import { Instagram, Heart, Sparkles } from 'lucide-react';
import { socialLinks } from '../data';
import { teacher } from '../data';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full bg-gradient-to-t from-gray-900 to-transparent border-t border-gray-800/50 py-12 px-4 text-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Instagram CTA */}
        <div className="mb-8" data-aos="fade-up">
          <a 
            href={socialLinks.classInstagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 hover:from-purple-700 hover:via-pink-600 hover:to-orange-600 text-white font-bold py-4 px-8 rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 group"
          >
            <Instagram size={24} className="group-hover:scale-110 transition-transform" />
            <span className="text-lg">Follow {teacher.class} on Instagram</span>
            <Sparkles size={18} className="group-hover:animate-pulse" />
          </a>
        </div>

        {/* Creator Credit */}
        <div className="mb-6" data-aos="fade-up" data-aos-delay="100">
          <p className="text-gray-400 text-lg mb-3">
            Crafted with <Heart className="inline w-4 h-4 text-red-400 animate-pulse" /> by
          </p>
          <a 
            href={socialLinks.creatorInstagram} 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gray-800/50 hover:bg-gray-700/50 backdrop-blur-sm border border-gray-700/50 text-cyan-400 font-semibold py-3 px-6 rounded-xl hover:text-cyan-300 hover:border-cyan-400/50 transition-all duration-300 hover:scale-105 group"
          >
            <Instagram size={18} />
            <span>@___what_me</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse group-hover:animate-ping"></div>
          </a>
        </div>

        {/* Copyright */}
        <div data-aos="fade-up" data-aos-delay="200">
          <p className="text-gray-500 text-sm">
            © {currentYear} {teacher.class}. All Rights Reserved.
          </p>
          <p className="text-gray-600 text-xs mt-2">
            Made for memories, built with passion ✨
          </p>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none"></div>
    </footer>
  );
};

export default Footer;
