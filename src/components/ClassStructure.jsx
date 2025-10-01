// StrukturKelas.jsx (VERSI FINAL DENGAN GARIS YANG RAPI)

import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
// Pastikan path ke file data Anda benar
import { classStructureData } from "../data"; 

// Komponen Card untuk setiap anggota (tidak perlu diubah)
const RoleCard = ({ jabatan, nama, isMain = false }) => (
  <div className="flex flex-col items-center text-center z-10">
    <h3 className="text-sm text-gray-400 font-medium tracking-wider">{jabatan}</h3>
    <div
      className={`mt-1 px-5 py-2 rounded-lg font-semibold text-base transition-all duration-300 shadow-lg ${
        isMain
          ? "bg-white text-gray-900 shadow-cyan-500/20"
          : "bg-gray-800/50 text-white border border-gray-700 hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/10"
      }`}
    >
      {nama}
    </div>
  </div>
);

// Komponen untuk seksi dengan banyak anggota (tidak perlu diubah)
const SectionCard = ({ jabatan, anggota }) => (
  <div className="flex flex-col items-center text-center w-full h-full z-10">
    <h3 className="text-sm text-gray-400 font-medium tracking-wider">{jabatan}</h3>
    <div className="mt-1 p-3 rounded-lg bg-gray-800/50 border border-gray-700 w-full flex flex-col items-center space-y-2 h-full">
      {anggota.map((nama, index) => (
        <p key={index} className="font-medium text-white text-sm">
          {nama}
        </p>
      ))}
    </div>
  </div>
);

const StrukturKelas = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    AOS.refresh();
  }, []);

  return (
    <div className="w-full flex flex-col items-center py-12 px-4 font-sans" data-aos="fade-up" data-aos-offset="200">

      {/* WALI KELAS */}
      <div className="relative" data-aos="fade-down">
        <RoleCard jabatan={classStructureData.waliKelas.jabatan} nama={classStructureData.waliKelas.nama} isMain />
        {/* Garis ke bawah */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-12 bg-gray-700" />
      </div>

      {/* KETUA & WAKIL */}
      <div className="w-full max-w-md mt-12 relative" data-aos="zoom-in">
        {/* Garis Horizontal */}
        <div className="absolute top-6 left-0 w-full h-0.5 bg-gray-700" />
        {/* Garis Vertikal dari atas */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-gray-700" />
        <div className="flex justify-between pt-12">
            {classStructureData.ketuaWakil.map((person, index) => (
              <div key={index} className="relative flex justify-center w-1/2">
                  <RoleCard jabatan={person.jabatan} nama={person.nama} />
              </div>
            ))}
        </div>
      </div>
      
      {/* Garis Penghubung antar Tingkat */}
      <div className="w-0.5 h-12 bg-gray-700" data-aos="fade-in" data-aos-delay="100"/>

      {/* SEKRETARIS & BENDAHARA */}
      <div className="w-full max-w-md relative" data-aos="zoom-in" data-aos-delay="200">
        <div className="absolute top-6 left-0 w-full h-0.5 bg-gray-700" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-gray-700" />
        <div className="flex justify-between pt-12">
            {classStructureData.sekretarisBendahara.map((section, index) => (
              <div key={index} className="relative flex justify-center w-5/12">
                  <SectionCard jabatan={section.jabatan} anggota={section.anggota} />
              </div>
            ))}
        </div>
      </div>
      
      {/* Garis Penghubung antar Tingkat */}
      <div className="w-0.5 h-12 bg-gray-700" data-aos="fade-in" data-aos-delay="300" />

      {/* SEKSI-SEKSI */}
      <div className="w-full max-w-4xl relative" data-aos="zoom-in-up" data-aos-delay="400">
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[95%] md:w-full h-0.5 bg-gray-700" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-gray-700" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12 pt-12">
          {classStructureData.seksi.map((section, index) => (
             <div key={index} className="relative flex flex-col items-center">
                <div className="absolute bottom-full mb-0 w-0.5 h-6 bg-gray-700" />
                <SectionCard jabatan={section.jabatan} anggota={section.anggota} />
             </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StrukturKelas;