import React, { useState, useEffect, useCallback } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { supabase } from "../supabaseClient";
import { Download, Heart, Share2 } from "lucide-react";

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [likedImages, setLikedImages] = useState(new Set());

  const fetchApprovedImages = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("image_requests")
      .select("image_path, likes, id")
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching images:", error);
      return;
    }

    if (data) {
      const imageData = data.map(file => ({
        id: file.id,
        url: supabase.storage.from("approved_images").getPublicUrl(file.image_path).data.publicUrl,
        likes: file.likes || 0,
        path: file.image_path
      }));
      setImages(imageData);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchApprovedImages();

    const channel = supabase
      .channel("image_requests_gallery")
      .on("postgres_changes", 
        { event: "*", schema: "public", table: "image_requests" }, 
        fetchApprovedImages
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchApprovedImages]);

  const handleImageClick = (currentIndex) => {
    setIndex(currentIndex);
    setOpen(true);
  };

  const handleLike = async (imageId, imagePath) => {
    if (likedImages.has(imageId)) return;

    try {
      const { data } = await supabase
        .from("image_requests")
        .select("likes")
        .eq("id", imageId)
        .single();

      const newLikes = (data?.likes || 0) + 1;

      await supabase
        .from("image_requests")
        .update({ likes: newLikes })
        .eq("id", imageId);

      setLikedImages(prev => new Set(prev.add(imageId)));
      setImages(prev => prev.map(img => 
        img.id === imageId ? { ...img, likes: newLikes } : img
      ));
    } catch (error) {
      console.error("Error liking image:", error);
    }
  };

  const handleDownload = async (imageUrl, imageName) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `rescoe-${imageName || 'memory'}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleShare = async (imageUrl) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this memory from Rescoe Republika!',
          url: imageUrl,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(imageUrl).then(() => {
        alert('Link copied to clipboard! 📋');
      });
    }
  };

  if (loading) {
    return (
      <section className="py-12 px-4">
        <h2 className="text-3xl font-bold text-white text-center mb-8">
          Galeri Kelas
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {[...Array(8)].map((_, idx) => (
            <div key={idx} className="aspect-square bg-gray-800 rounded-2xl animate-pulse">
              <div className="w-full h-full bg-gray-700 rounded-2xl"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-12 px-4" data-aos="fade-up">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Memory Gallery 🎞️
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Kumpulan momen berharga dan kenangan indah kita bersama di {images.length} foto
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {images.map((image, idx) => (
            <div
              key={image.id}
              className="group relative bg-gray-800 rounded-2xl overflow-hidden shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 hover:scale-105"
            >
              {/* Image */}
              <div 
                className="aspect-square bg-gray-700 cursor-pointer"
                onClick={() => handleImageClick(idx)}
              >
                <img
                  src={image.url}
                  alt={`Kenangan Kelas ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
              </div>

              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
                <div className="flex justify-between items-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(image.id, image.path);
                    }}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-full text-sm font-semibold transition-all ${
                      likedImages.has(image.id) 
                        ? 'bg-red-500 text-white' 
                        : 'bg-white/20 text-white backdrop-blur-sm hover:bg-red-500'
                    }`}
                  >
                    <Heart size={16} fill={likedImages.has(image.id) ? "currentColor" : "none"} />
                    <span>{image.likes || 0}</span>
                  </button>

                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(image.url, image.path);
                      }}
                      className="bg-white/20 p-2 rounded-full backdrop-blur-sm hover:bg-cyan-500 transition-all"
                    >
                      <Download size={16} className="text-white" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare(image.url);
                      }}
                      className="bg-white/20 p-2 rounded-full backdrop-blur-sm hover:bg-green-500 transition-all"
                    >
                      <Share2 size={16} className="text-white" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Loading Skeleton */}
              <div className="absolute inset-0 bg-gray-700 animate-pulse rounded-2xl opacity-0 group-hover:opacity-0 transition-opacity" />
            </div>
          ))}
        </div>

        {images.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📸</div>
            <h3 className="text-2xl font-bold text-gray-400 mb-2">Galeri Masih Kosong</h3>
            <p className="text-gray-500">Jadilah yang pertama mengirim kenangan!</p>
          </div>
        )}
      </section>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={images.map(img => ({ src: img.url }))}
        render={{
          slide: (image, offset, rect) => (
            <img 
              src={image.src} 
              alt="" 
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
              }}
            />
          )
        }}
      />
    </>
  );
};

export default Gallery;
