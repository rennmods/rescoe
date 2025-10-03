import React, { useState, useRef } from "react";
import { supabase } from "../supabaseClient";
import Swal from "sweetalert2";
import { Smile, Send, Zap } from "lucide-react";

const MessageForm = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef(null);

  const ADMIN_ID = "7b1ec8ee-631d-4643-9024-dc8a2f2c5dfa";

  const popularEmojis = ['😊', '😂', '🥰', '😎', '🔥', '✨', '🚀', '💫', '🤩', '👏', '🎉', '❤️', '👍', '👀', '💯'];

  const insertEmoji = (emoji) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newMessage = message.substring(0, start) + emoji + message.substring(end);
    
    setMessage(newMessage);
    setShowEmojiPicker(false);
    
    // Focus back to textarea and set cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + emoji.length, start + emoji.length);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      Swal.fire({
        title: "Oops! 🫣",
        text: "Pesan tidak boleh kosong",
        icon: "warning",
        background: "#1e2b3b",
        color: "#ffffff",
        confirmButtonColor: "#06b6d4"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("messages")
        .insert([
          {
            recipient_id: ADMIN_ID,
            content: message,
          },
        ]);

      if (error) throw error;

      Swal.fire({
        title: "Terkirim! 🚀",
        text: "Pesan anonimmu berhasil dikirim!",
        icon: "success",
        background: "#1e2b3b",
        color: "#ffffff",
        confirmButtonColor: "#10b981",
        timer: 2000,
        timerProgressBar: true,
      });

      setMessage("");
    } catch (error) {
      console.error("Supabase insert error:", error);
      Swal.fire({
        title: "Gagal 😔",
        text: error.message,
        icon: "error",
        background: "#1e2b3b",
        color: "#ffffff",
        confirmButtonColor: "#ef4444"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-12 px-4 max-w-2xl mx-auto" data-aos="fade-up">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl mb-4">
          <Zap className="text-white" size={28} />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">
          Kirim Pesan Rahasia ✨
        </h2>
        <p className="text-gray-400">
          Sampaikan pesan, kritik, saran, atau apresiasi secara anonim
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden"
      >
        <div className="p-1">
          <div className="relative">
            <textarea
              ref={textareaRef}
              rows="5"
              placeholder="Tulis pesan rahasiamu di sini... 💫"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-6 bg-transparent text-white placeholder-gray-500 border-none focus:outline-none focus:ring-0 resize-none text-lg"
              disabled={loading}
            />
            
            {/* Character Counter */}
            <div className="absolute bottom-2 right-4 text-sm text-gray-500">
              {message.length}/500
            </div>
          </div>

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div className="border-t border-gray-700 p-4 bg-gray-900/80 backdrop-blur-sm">
              <div className="flex flex-wrap gap-2 justify-center">
                {popularEmojis.map((emoji, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => insertEmoji(emoji)}
                    className="text-2xl hover:scale-125 transition-transform duration-200 p-1"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center p-4 bg-gray-900/50 border-t border-gray-700/50">
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-3 text-gray-400 hover:text-cyan-400 hover:bg-gray-700/50 rounded-xl transition-all duration-200"
            >
              <Smile size={20} />
            </button>

            <button
              type="submit"
              disabled={loading || !message.trim()}
              className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Mengirim...</span>
                </>
              ) : (
                <>
                  <Send size={18} />
                  <span>Kirim Pesan</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Tips */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          💡 Pesan akan langsung terkirim ke admin kelas
        </p>
      </div>
    </section>
  );
};

export default MessageForm;
