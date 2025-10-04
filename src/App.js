import React, { useState, useEffect, useCallback } from "react";
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
import ErrorBoundary from "./components/ErrorBoundary";
import SeasonalTheme from "./components/SeasonalTheme";
import { teacher } from "./data";

function App() {
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [view, setView] = useState("login");

  const setupSession = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      
      if (session) {
        setUserEmail(session.user.email);
        await checkIfAdmin(session.user.id);
        setView("main");
      }
    } catch (error) {
      console.error("Session setup error:", error);
      setView("login");
    }
  }, []);

  const checkIfAdmin = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      setIsAdmin(!!(data && data.role === "admin"));
    } catch (error) {
      console.error("Error checking admin status:", error);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    AOS.init({ 
      duration: 800, 
      once: true,
      offset: 50
    });

    setupSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        if (session) {
          setUserEmail(session.user.email);
          await checkIfAdmin(session.user.id);
          setView("main");
        } else {
          setIsAdmin(false);
          setUserEmail(null);
          setView("login");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [setupSession]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // Langsung render konten berdasarkan view tanpa loading
  if (!session) {
    if (view === "reset") return <ResetPassword onBack={() => setView("login")} />;
    return <LoginPage onForgotPassword={() => setView("reset")} />;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white font-sans relative overflow-hidden">
        <SeasonalTheme />
        
        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-20 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${8 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>

        {/* User Info & Logout */}
        <div className="absolute top-6 right-6 z-50 flex flex-col items-end space-y-3">
          {userEmail && (
            <div className="bg-gray-800/70 px-4 py-2 rounded-xl text-sm shadow-lg backdrop-blur-sm border border-gray-700/50 max-w-xs">
              <p className="text-white font-medium truncate">{userEmail}</p>
              <p className={`font-bold text-xs ${isAdmin ? 'text-cyan-400' : 'text-green-400'}`}>
                {isAdmin ? "👑 Admin" : "⭐ Member"}
              </p>
            </div>
          )}
          
          <button
            onClick={handleLogout}
            className="bg-red-600/80 hover:bg-red-700 hover:scale-105 text-white font-bold py-2 px-4 rounded-xl shadow-lg transition-all duration-200 flex items-center space-x-2 group"
          >
            <span>Logout</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>

        {/* Main Content */}
        <Home className={teacher.class} />
        <div id="content" className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          <Header teacherName={teacher.name} className="Our Class" />
          <main className="space-y-16">
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
    </ErrorBoundary>
  );
}

export default App;
