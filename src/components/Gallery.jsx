import React, { useState, useEffect } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { supabase } from "../supabaseClient";

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const fetchApprovedImages = async () => {
    const { data, error } = await supabase
      .from('image_requests')
      .select('image_path')
      .eq('status', 'approved');

    if (data) {
      const imageUrls = data.map(file => 
        supabase.storage.from('approved_images').getPublicUrl(file.image_path).data.publicUrl
      );
      setImages(imageUrls);
    }
  };

  useEffect(() => {
    fetchApprovedImages();

    // Supabase Realtime: Dengarkan perubahan di tabel image_requests
    const channel = supabase
      .channel('image_requests_gallery')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'image_requests' }, payload => {
        fetchApprovedImages(); // Jika ada perubahan, muat ulang galeri
      })
      .subscribe();
    
    // Cleanup subscription saat komponen di-unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleImageClick = (currentIndex) => {
    setIndex(currentIndex);
    setOpen(true);
  };

  return (
    <>
      <section className="py-12 px-4" data-aos="fade-up">
        <h2 className="text-3xl font-bold text-white text-center mb-8">
          Galeri Kelas
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {images.map((imageUrl, idx) => (
            <div key={idx} className="aspect-square bg-gray-800 rounded-lg overflow-hidden cursor-pointer" onClick={() => handleImageClick(idx)}>
              <img src={imageUrl} alt={`Kenangan Kelas ${idx + 1}`} className="w-full h-full object-cover"/>
            </div>
          ))}
        </div>
        {images.length === 0 && <p className="text-center text-gray-400">Galeri masih kosong. Kirim fotomu!</p>}
      </section>
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={images.map((img) => ({ src: img }))}
      />
    </>
  );
};

export default Gallery;