// src/data.js (VERSI LENGKAP & FINAL)

// Data struktur kelas yang baru
export const classStructureData = {
  waliKelas: {
    jabatan: "Wali Kelas",
    nama: "Yosephine",
  },
  ketuaWakil: [
    { jabatan: "Ketua Kelas", nama: "Tian" },
    { jabatan: "Wakil Ketua", nama: "Arya" },
  ],
  sekretarisBendahara: [
    {
      jabatan: "Sekretaris",
      anggota: ["Levina", "Muti"],
    },
    {
      jabatan: "Bendahara",
      anggota: ["Alexa", "Maria"],
    },
  ],
  seksi: [
    {
      jabatan: "Keamanan",
      anggota: ["Wiliam", "Gio"],
    },
    {
      jabatan: "Kebersihan",
      anggota: ["Sdyney"],
    },
    {
      jabatan: "Kesehatan",
      anggota: ["Joel"],
    },
    {
      jabatan: "Keagamaan",
      anggota: ["Lionel"],
    },
  ],
};

// Data lama yang masih dibutuhkan oleh komponen lain (kita tambahkan kembali)
export const teacher = {
  name: "Yosephine",
  class: "XI IPA 1",
};  

export const dailySchedules = [
    { day: "Senin", subjects: ["Biologi", "PL", "PKN", "MTK Wajib", "Bahasa Inggris"], piket: ["Galuh", "Maria", "Tian", "Davin", "Ardo", "Isa", "Neo"] },
    { day: "Selasa", subjects: ["Informatika", "Bahasa Indonesia", "Teachcast", "Kimia", "BK", "Bahasa Jawa"], piket: ["Tata", "Febbie", "Lionel", "Elang", "Mario", "Gio", "Noel"] },
    { day: "Rabu", subjects: ["Agama", "Fisika", "PJOK", "MTK Minat"], piket: ["Sdyney", "Muti", "Joel", "Rafael", "Valen", "Dimas", "Arya"] },
    { day: "Kamis", subjects: ["MTK Wajib", "Informatia", "Sejarah", "Biologi", "SBD"], piket: ["Vina", "Hennesy", "William", "Abed", "Alvin", "Gabriel", "Zaga"] },
    { day: "Jumat", subjects: ["Fisika", "MTK Minat", "Bahasa Indonesia", "Kimia"], piket: ["alexa", "Una", "Edu", "Eduard", "Geo", "Naren", "Nathan"] },
    { day: "Sabtu", subjects: ["Libur"], piket: ["Tidak ada piket"] },
    { day: "Minggu", subjects: ["Libur!"], piket: ["Tidak ada piket"] }
];

export const socialLinks = {
  classInstagram: "https://www.instagram.com/rescoexi", // <-- Ganti ini
  creatorInstagram: "https://www.instagram.com/___what_me",
};