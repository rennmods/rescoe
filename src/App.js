import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import AOS from "aos";
import "aos/dist/aos.css";

// Components
import Home from "./components/Home";
import Header from "./components/Header";
import TabsView from "./components/TabsView";
import AdminPanel from "./components/AdminPanel";
import MessageForm from "./components/MessageForm";
import MessageList from "./components/MessageList";
import ImageUpload from "./components/ImageUpload";
import Gallery from "./components/Gallery";
import Footer from "./components/Footer";
import LoginPage from "./components/LoginPage";
import ResetPassword from "./components/ResetPassword"; 
import { teacher } from "./data";

function App() {
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState(null);
  const [view, setView] = useState("login"); 
  // "login" | "reset" | "main"

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    const setupSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session) {
        setUserEmail(session.user.email);
        await checkIfAdmin(session.user.id);
        setView("main");
      }
      setLoading(false);
    };

    setupSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        setUserEmail(session.user.email);
        checkIfAdmin(session.user.id);
        setView("main");
      } else {
        setIsAdmin(false);
        setUserEmail(null);
        setView("login");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkIfAdmin = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

      if (error && error.code !== "PGRST116") throw error;

      if (data && data.role === "admin") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
      setIsAdmin(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  // Tampilkan halaman sesuai state
  if (!session) {
    if (view === "reset") return <ResetPassword onBack={() => setView("login")} />;
    return <LoginPage onForgotPassword={() => setView("reset")} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      {/* Info user & Logout */}
      <div className="absolute top-6 right-6 z-50 flex flex-col items-end space-y-2">
        {userEmail && (
          <div className="bg-gray-800/70 px-4 py-2 rounded-lg text-sm sm:text-base shadow-md backdrop-blur-sm">
            <p className="text-white font-medium">{userEmail}</p>
            <p className="text-cyan-400 font-bold text-xs sm:text-sm">
              {isAdmin ? "Admin" : "Member"}
            </p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="bg-red-600/80 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <Home className={teacher.class} />
      <div id="content" className="container mx-auto px-4 sm:px-6 md:px-8">
        <Header teacherName={teacher.name} className="Our Class" />
        <main>
          <TabsView />
          {isAdmin && <AdminPanel />}
          <ImageUpload />
          <Gallery />
          <MessageForm />
          <MessageList />
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default App;
