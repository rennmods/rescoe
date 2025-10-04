import React, { useEffect, useState } from 'react';
// Import supabase dihapus karena tidak digunakan

const SeasonalTheme = () => {
  const [theme, setTheme] = useState('default');
  const [showEffect, setShowEffect] = useState(false);

  useEffect(() => {
    const checkSeason = () => {
      const now = new Date();
      const month = now.getMonth() + 1;
      const date = now.getDate();

      // Valentine's Day (Feb 14)
      if (month === 2 && date === 14) {
        setTheme('valentine');
      }
      // April Fool's (Apr 1)
      else if (month === 4 && date === 1) {
        setTheme('april-fools');
      }
      // Halloween (Oct 31)
      else if (month === 10 && date === 31) {
        setTheme('halloween');
      }
      // Christmas (Dec 15-31)
      else if (month === 12 && date >= 15) {
        setTheme('christmas');
      }
      // New Year (Dec 31 - Jan 2)
      else if ((month === 12 && date === 31) || (month === 1 && date <= 2)) {
        setTheme('new-year');
      }
      // Class Anniversary (Ganti dengan tanggal penting kelas)
      else if (month === 8 && date === 17) { // Contoh: 17 Agustus
        setTheme('anniversary');
      }
      else {
        setTheme('default');
      }
    };

    checkSeason();
    
    // Trigger effect animation
    setShowEffect(true);
    const timer = setTimeout(() => setShowEffect(false), 3000);

    return () => clearTimeout(timer);
  }, []);

  const getThemeConfig = () => {
    const themes = {
      valentine: {
        gradient: 'from-pink-900 via-rose-900 to-red-900',
        particles: 'bg-pink-400',
        emoji: '❤️',
        message: 'Happy Valentine Day! 💝'
      },
      christmas: {
        gradient: 'from-green-900 via-red-900 to-green-900',
        particles: 'bg-red-400',
        emoji: '🎄',
        message: 'Merry Christmas! 🎅'
      },
      halloween: {
        gradient: 'from-orange-900 via-purple-900 to-gray-900',
        particles: 'bg-orange-400',
        emoji: '🎃',
        message: 'Spooky Halloween! 👻'
      },
      'new-year': {
        gradient: 'from-blue-900 via-purple-900 to-cyan-900',
        particles: 'bg-yellow-400',
        emoji: '🎆',
        message: 'Happy New Year! 🥳'
      },
      'april-fools': {
        gradient: 'from-green-900 via-yellow-900 to-green-900',
        particles: 'bg-green-400',
        emoji: '🤡',
        message: 'April Fools! Watch out for pranks! 😜'
      },
      anniversary: {
        gradient: 'from-purple-900 via-blue-900 to-cyan-900',
        particles: 'bg-cyan-400',
        emoji: '🎉',
        message: 'Happy Class Anniversary! 🥳'
      },
      default: null
    };

    return themes[theme] || null;
  };

  const themeConfig = getThemeConfig();

  if (!themeConfig) return null;

  return (
    <>
      {/* Seasonal Gradient Overlay */}
      <div className={`fixed inset-0 bg-gradient-to-br ${themeConfig.gradient} opacity-20 pointer-events-none z-0`} />
      
      {/* Seasonal Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i}
            className={`absolute w-2 h-2 ${themeConfig.particles} rounded-full opacity-40 animate-float`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${10 + Math.random() * 15}s`
            }}
          />
        ))}
      </div>

      {/* Seasonal Notification */}
      {showEffect && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-4 shadow-2xl">
            <div className="flex items-center space-x-3 text-white font-semibold">
              <span className="text-2xl">{themeConfig.emoji}</span>
              <span>{themeConfig.message}</span>
              <span className="text-2xl">{themeConfig.emoji}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SeasonalTheme;
