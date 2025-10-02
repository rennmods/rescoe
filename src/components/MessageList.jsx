import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const MessageList = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("id, content, created_at")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();

    // Realtime update saat ada pesan baru
    const channel = supabase
      .channel("messages-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          setMessages((prev) => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <div className="text-center text-gray-400 py-6">Memuat pesan...</div>
    );
  }

  return (
    <section className="py-8 px-4 max-w-2xl mx-auto" data-aos="fade-up">
      <h2 className="text-2xl font-bold text-center mb-6 text-white">
        Pesan Masuk 📩
      </h2>
      <div className="space-y-4">
        {messages.length > 0 ? (
          messages.map((msg) => (
            <div
              key={msg.id}
              className="p-4 rounded-lg bg-gray-800/70 border border-gray-700 text-white shadow-md"
            >
              <p className="text-gray-200">{msg.content}</p>
              <p className="text-xs text-gray-500 mt-2">
                {new Date(msg.created_at).toLocaleString("id-ID")}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400">Belum ada pesan 😶</p>
        )}
      </div>
    </section>
  );
};

export default MessageList;
