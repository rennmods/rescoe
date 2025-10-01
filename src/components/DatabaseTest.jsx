import React from 'react';
import { supabase } from '../supabaseClient';

const DatabaseTest = () => {
  const runTest = async () => {
    console.log("Mencoba memasukkan data ke database...");
    
    // Kita coba masukkan data palsu yang sangat sederhana
    const { data, error } = await supabase
      .from('image_requests')
      .insert([
        { image_path: 'test_file.jpg', status: 'pending' }
      ]);

    if (error) {
      console.error("TES GAGAL:", error);
      alert("Tes Gagal! Cek pesan error di console (F12). Pesan: " + error.message);
    } else {
      console.log("TES BERHASIL:", data);
      alert("TES BERHASIL! Database berhasil menerima data.");
    }
  };

  return (
    <div className="bg-yellow-500/20 border border-yellow-500 text-white p-4 rounded-lg my-8 text-center">
      <h3 className="font-bold text-lg mb-2">Panel Diagnosis</h3>
      <p className="mb-4">Klik tombol ini untuk menguji koneksi ke database secara langsung.</p>
      <button 
        onClick={runTest} 
        className="bg-yellow-500 font-bold py-2 px-6 rounded-lg hover:bg-yellow-600 transition"
      >
        Jalankan Tes Database
      </button>
    </div>
  );
};

export default DatabaseTest;
