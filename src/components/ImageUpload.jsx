// src/components/ImageUpload.jsx
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import Swal from 'sweetalert2';

const ImageUpload = () => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (event) => {
    try {
      setUploading(true);
      const file = event.target.files[0];
      if (!file) {
        throw new Error("Anda harus memilih gambar untuk diunggah.");
      }

      const fileName = `${Date.now()}_${file.name}`;
      const filePath = `${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from('pending_images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Jika berhasil, catat di database
      let { error: insertError } = await supabase
        .from('image_requests')
        .insert([{ image_path: filePath, status: 'pending' }]);

      if (insertError) {
        throw insertError;
      }

      Swal.fire('Berhasil!', 'Fotomu sudah terkirim dan sedang menunggu persetujuan Admin.', 'success');

    } catch (error) {
      Swal.fire('Oops!', error.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="text-center my-10" data-aos="fade-up">
      <h2 className="text-3xl font-bold text-white mb-4">Kirim Foto Kenanganmu!</h2>
      <p className="text-gray-400 mb-6">Punya foto keren sekelas? Kirim di sini untuk ditampilkan di galeri.</p>
      <label htmlFor="upload-button" className="cursor-pointer bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-cyan-600 transition-all duration-300">
        {uploading ? 'Mengunggah...' : 'Pilih & Kirim Foto'}
      </label>
      <input
        type="file"
        id="upload-button"
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;