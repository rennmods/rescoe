import React, { useState, useEffect } from "react";
import { dailySchedules } from "../data";

const Schedule = () => {
  const [todaySchedule, setTodaySchedule] = useState({
    day: "Memuat...",
    subjects: [],
    piket: [],
  });

  useEffect(() => {
    const dayIndex = (new Date().getDay() + 6) % 7; // Senin = 0
    if (dailySchedules[dayIndex]) {
      setTodaySchedule(dailySchedules[dayIndex]);
    }
  }, []);

  return (
    <section className="mt-12 w-full max-w-4xl mx-auto text-center px-4">
      <h2 className="text-3xl font-bold text-white mb-6 drop-shadow-lg">
        {todaySchedule.day}
      </h2>

      <div className="bg-gray-900/70 rounded-xl p-6 shadow-lg grid md:grid-cols-2 gap-6">
        {/* Jadwal Pelajaran */}
        <div>
          <h3 className="text-xl text-cyan-400 mb-3 font-semibold">Jadwal</h3>
          {todaySchedule.subjects.length > 0 &&
          todaySchedule.subjects[0] !== "Libur!" ? (
            <ul className="space-y-2">
              {todaySchedule.subjects.map((subject, index) => (
                <li
                  key={index}
                  className="text-gray-200 text-base border-b border-gray-700 pb-1"
                >
                  {subject}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-lg">Tidak Ada Jadwal Hari Ini</p>
          )}
        </div>

        {/* Jadwal Piket */}
        <div>
          <h3 className="text-xl text-cyan-400 mb-3 font-semibold">Piket</h3>
          {todaySchedule.piket.length > 0 &&
          todaySchedule.piket[0] !== "Tidak ada piket" ? (
            <ul className="space-y-2">
              {todaySchedule.piket.map((student, index) => (
                <li
                  key={index}
                  className="text-gray-200 text-base border-b border-gray-700 pb-1"
                >
                  {student}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-lg">Tidak Ada Piket Hari Ini</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Schedule;
