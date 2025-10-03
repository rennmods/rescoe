import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import Swal from "sweetalert2";

const MessageForm = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Ganti ini dengan UUID user admin (cek di tabel auth.users)
  const ADMIN_ID = "7b1ec8ee-631d-4643-9024-dc8a2f2c5dfa";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      Swal.fire("Oops!", "Pesan tidak boleh kosong", "warning");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("messages")
        .insert([
          {
            recipient_id: ADMIN_ID, // semua pesan dikirim ke admin
            content: message,
          },
        ]);

      if (error) throw error;

      Swal.fire({
        title: "Terkirim 🚀",
        text: "Pesan anonimmu berhasil dikirim!",
        icon: "success",
        background: "#1e2b3b",
        color: "#ffffff",
      });

      setMessage(""); // reset input
    } catch (error) {
      console.error("Supabase insert error:", error);
      Swal.fire("Gagal", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-8 px-4 max-w-lg mx-auto" data-aos="fade-up">
      <h2 className="text-2xl font-bold text-center mb-6 text-white">
        Kirim Pesan Anonim ✨
      </h2>
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800/50 p-6 rounded-lg shadow-md backdrop-blur-sm"
      >
        <textarea
          rows="4"
          placeholder="Tulis pesanmu di sini..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-cyan-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg transition-transform duration-200 hover:scale-105 disabled:opacity-50"
        >
          {loading ? "Mengirim..." : "Kirim 🚀"}
        </button>
      </form>
    </section>
  );
};

export default MessageForm;
