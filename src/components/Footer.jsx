import React from 'react';
import { Instagram } from 'lucide-react';
import { socialLinks } from '../data'; // Impor link dari data
import { teacher } from '../data'; // Impor data guru untuk nama kelas

const Footer = () => {
  return (
    <footer className="w-full bg-gray-900/50 border-t border-gray-800 py-8 px-4 text-center text-gray-400">
      <div className="flex justify-center items-center mb-4">
        <a 
          href={socialLinks.classInstagram}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-lg text-white hover:text-cyan-400 transition-colors"
        >
          <Instagram size={24} />
          Follow {teacher.class}
        </a>
      </div>
      <p className="mb-2">
        Website created by{' '}
        <a 
          href={socialLinks.creatorInstagram} 
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-white hover:underline"
        >
          @___what_me
        </a>
      </p>
      <p className="text-sm">
        © {new Date().getFullYear()} {teacher.class}. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
