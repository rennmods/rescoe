import React from "react";
import { classStructureData } from "../data";

// Card jabatan utama (wali/ketua/wakil)
const RoleCard = ({ jabatan, nama, isMain = false }) => (
  <div className="flex flex-col items-center text-center z-10">
    <h3 className="text-sm text-gray-400 font-medium tracking-wider">{jabatan}</h3>
    <div
      className={`mt-1 px-5 py-2 rounded-lg font-semibold text-base shadow-lg ${
        isMain
          ? "bg-white text-gray-900 shadow-cyan-500/20"
          : "bg-gray-800/70 text-white border border-gray-700"
      }`}
    >
      {nama}
    </div>
  </div>
);

// Card seksi (bisa banyak anggota)
const SectionCard = ({ jabatan, anggota }) => (
  <div className="flex flex-col items-center text-center w-full z-10">
    <h3 className="text-sm text-gray-400 font-medium tracking-wider">{jabatan}</h3>
    <div className="mt-1 p-3 rounded-lg bg-gray-800/50 border border-gray-700 w-full flex flex-col items-center space-y-1">
      {anggota.map((nama, index) => (
        <p key={index} className="font-medium text-white text-sm">
          {nama}
        </p>
      ))}
    </div>
  </div>
);

const StrukturKelas = () => {
  return (
    <section className="w-full flex flex-col items-center py-12 px-4 font-sans">
      {/* Wali Kelas */}
      <div className="relative mb-12">
        <RoleCard
          jabatan={classStructureData.waliKelas.jabatan}
          nama={classStructureData.waliKelas.nama}
          isMain
        />
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-12 bg-gray-700" />
      </div>

      {/* Ketua & Wakil */}
      <div className="w-full max-w-md relative mb-12">
        <div className="absolute top-6 left-0 w-full h-0.5 bg-gray-700" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-gray-700" />
        <div className="flex justify-between pt-12">
          {classStructureData.ketuaWakil.map((person, index) => (
            <div key={index} className="w-1/2 flex justify-center">
              <RoleCard jabatan={person.jabatan} nama={person.nama} />
            </div>
          ))}
        </div>
      </div>

      {/* Sekretaris & Bendahara */}
      <div className="w-full max-w-md relative mb-12">
        <div className="absolute top-6 left-0 w-full h-0.5 bg-gray-700" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-gray-700" />
        <div className="flex justify-between pt-12">
          {classStructureData.sekretarisBendahara.map((section, index) => (
            <div key={index} className="w-5/12 flex justify-center">
              <SectionCard jabatan={section.jabatan} anggota={section.anggota} />
            </div>
          ))}
        </div>
      </div>

      {/* Seksi-seksi */}
      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
          {classStructureData.seksi.map((section, index) => (
            <div key={index} className="flex flex-col items-center">
              <SectionCard jabatan={section.jabatan} anggota={section.anggota} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StrukturKelas;
