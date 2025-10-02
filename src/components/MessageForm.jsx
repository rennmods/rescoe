import React, { useState } from "react";
import { supabase } from "../supabaseClient";

const MessageForm = () => {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const { error } = await supabase
      .from("messages")
      .insert([{ content: message }]);

    if (error) {
      setStatus("❌ Gagal mengirim pesan");
      console.error(error);
    } else {
      setStatus("✅ Pesan terkirim!");
      setMessage("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-900/70 p-6 rounded-xl shadow-lg max-w-md mx-auto mt-8"
    >
      <h2 className="text-xl font-bold text-white mb-4 text-center">
        Kirim Pesan Anonim ✨
      </h2>
      <textarea
        className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        rows="4"
        placeholder="Tulis pesanmu di sini..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      ></textarea>
      <button
        type="submit"
        className="w-full mt-4 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg"
      >
        Kirim 🚀
      </button>
      {status && <p className="text-center text-sm text-gray-300 mt-3">{status}</p>}
    </form>
  );
};

export default MessageForm;
