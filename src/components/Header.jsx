// src/components/Header.jsx
import React from 'react';
import { BookUser } from 'lucide-react';

const Header = ({ teacherName, className }) => (
  <header className="text-center p-8 bg-slate-900/50 rounded-xl shadow-lg backdrop-blur-sm">
    <h1 className="text-4xl md:text-6xl font-bold text-white tracking-wider">{className}</h1>
    <div className="flex items-center justify-center mt-4 text-xl text-cyan-300">
      <BookUser className="w-6 h-6 mr-3" />
      <p>Wali Kelas: {teacherName}</p>
    </div>
  </header>
);

export default Header;