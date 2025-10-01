// src/components/Schedule.jsx (VERSI BARU)

import React, { useState, useEffect } from 'react';
import { dailySchedules } from '../data';
import 'aos/dist/aos.css';

const Schedule = () => {
  const [todaySchedule, setTodaySchedule] = useState({
    day: 'Memuat...',
    subjects: [],
    piket: [],
  });

  useEffect(() => {
    // getDay() mengembalikan 0 untuk Minggu, 1 untuk Senin, dst.
    // Kita sesuaikan agar Senin = 0, ..., Minggu = 6
    const dayIndex = (new Date().getDay() + 6) % 7; 
    
    if (dailySchedules[dayIndex]) {
      setTodaySchedule(dailySchedules[dayIndex]);
    }
  }, []);

  return (
    <section className="mt-12 w-full max-w-4xl mx-auto text-center" data-aos="fade-up">
      <div className="bg-slate-900/50 rounded-xl p-6 backdrop-blur-sm shadow-lg">
        {/* Judul Hari */}
        <h3 className="text-3xl font-bold text-white mb-6 uppercase">{todaySchedule.day}</h3>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Jadwal Pelajaran */}
          <div data-aos="fade-right" data-aos-delay="200">
            <h4 className="text-xl text-gray-300 mb-3 font-semibold">Jadwal</h4>
            {todaySchedule.subjects.length > 0 && todaySchedule.subjects[0] !== "Libur!" ? (
              <ul className="space-y-2">
                {todaySchedule.subjects.map((subject, index) => (
                  <li key={index} className="text-gray-200 text-lg">
                    {subject}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 text-lg">Tidak Ada Jadwal Hari Ini</p>
            )}
          </div>

          {/* Jadwal Piket */}
          <div data-aos="fade-left" data-aos-delay="400">
            <h4 className="text-xl text-gray-300 mb-3 font-semibold">Piket</h4>
            {todaySchedule.piket.length > 0 && todaySchedule.piket[0] !== "Tidak ada piket" ? (
              <ul className="space-y-2">
                {todaySchedule.piket.map((student, index) => (
                  <li key={index} className="text-gray-200 text-lg">
                    {student}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 text-lg">Tidak Ada Jadwal Hari Ini</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Schedule;
