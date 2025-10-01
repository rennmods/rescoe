import React from 'react';
import { Instagram } from 'lucide-react';
import { socialLinks } from '../data'; // Impor link dari data

const InstagramCTA = () => {
  return (
    <section className="my-16" data-aos="fade-up">
      <a
        href={socialLinks.classInstagram}
        target="_blank"
        rel="noopener noreferrer"
        className="block max-w-4xl mx-auto p-8 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 rounded-2xl shadow-lg
                   transform transition-transform duration-300 hover:scale-105"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Instagram size={48} className="text-white" />
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Follow Us on Instagram
              </h2>
              <p className="text-white/80 text-lg">
                Lihat keseruan dan update terbaru dari kelas kami!
              </p>
            </div>
          </div>
          <div className="bg-white text-pink-500 font-bold py-3 px-6 rounded-lg text-lg">
            Kunjungi Profil
          </div>
        </div>
      </a>
    </section>
  );
};

export default InstagramCTA;