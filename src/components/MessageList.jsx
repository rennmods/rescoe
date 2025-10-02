import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const MessageList = () => {
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.error(error);
    else setMessages(data);
  };

  useEffect(() => {
    fetchMessages();

    // Supabase realtime untuk pesan baru
    const channel = supabase
      .channel("messages_channel")
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

  return (
    <section className="max-w-2xl mx-auto mt-12 px-4">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Pesan Masuk 📩</h2>
      <div className="space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="bg-gray-800/80 text-white p-4 rounded-lg shadow-md"
          >
            <p>{msg.content}</p>
            <span className="text-xs text-gray-400">
              {new Date(msg.created_at).toLocaleString()}
            </span>
          </div>
        ))}
        {messages.length === 0 && (
          <p className="text-center text-gray-400">Belum ada pesan 🙃</p>
        )}
      </div>
    </section>
  );
};

export default MessageList;
