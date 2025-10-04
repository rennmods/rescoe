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
  const [isInitializing, setIsInitializing] = useState(true);

  // Fungsi untuk membuat profil user baru
  const createUserProfile = async (userId, email) => {
    try {
      console.log("📦 Creating new profile for user:", email);
      
      const { error } = await supabase
        .from("profiles")
        .insert([
          {
            id: userId,
            email: email,
            role: 'user', // Default role
            created_at: new Date().toISOString()
          }
        ]);

      if (error) {
        // Jika sudah ada, ignore
        if (error.code === '23505') {
          console.log("ℹ️ Profile already exists");
          return;
        }
        throw error;
      }
      console.log("✅ New user profile created");
    } catch (error) {
      console.error("❌ Error creating profile:", error);
    }
  };

  const checkIfAdmin = async (userId) => {
    try {
      console.log("🔍 Checking admin status for user:", userId);
      
      const { data, error } = await supabase
        .from("profiles")
        .select("role, email")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("❌ Error fetching profile:", error);
        
        // Jika tabel tidak ada atau row tidak ditemukan, buat profil baru
        if (error.code === "PGRST116" || error.code === "406") {
          console.log("📦 Profile not found, creating new one...");
          const { data: userData } = await supabase.auth.getUser();
          if (userData.user) {
            await createUserProfile(userId, userData.user.email);
          }
          setIsAdmin(false);
          return;
        }
        throw error;
      }

      console.log("✅ Profile data:", data);
      const isUserAdmin = !!(data && data.role === "admin");
      setIsAdmin(isUserAdmin);
      
      if (isUserAdmin) {
        console.log("🎉 User is ADMIN");
      } else {
        console.log("👤 User is regular member");
      }
      
    } catch (error) {
      console.error("❌ Error checking admin status:", error);
      setIsAdmin(false);
    }
  };

  const setupSession = useCallback(async () => {
    try {
      console.log("🔧 Setting up session...");
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Session error:", error);
        throw error;
      }
      
      setSession(session);
      
      if (session) {
        console.log("✅ User logged in:", session.user.email);
        setUserEmail(session.user.email);
        await checkIfAdmin(session.user.id);
        setView("main");
      } else {
        console.log("🔐 No session found, showing login");
        setView("login");
      }
    } catch (error) {
      console.error("Session setup error:", error);
      setView("login");
    } finally {
      setIsInitializing(false);
      console.log("🏁 Session setup completed");
    }
  }, []);

  useEffect(() => {
    console.log("🎬 Initializing App...");
    
    AOS.init({ 
      duration: 800, 
      once: true,
      offset: 50
    });

    let mounted = true;

    const initializeApp = async () => {
      try {
        await setupSession();
      } catch (error) {
        console.error("App initialization error:", error);
        if (mounted) {
          setIsInitializing(false);
          setView("login");
        }
      }
    };

    initializeApp();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return;
        
        console.log("🔄 Auth state changed:", _event);
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
        setIsInitializing(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
      console.log("🧹 App cleanup completed");
    };
  }, [setupSession]);

  const handleLogout = async () => {
    try {
      console.log("🚪 Logging out...");
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      console.log("✅ Logout successful");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Skeleton screen selama initializing
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white">
        <div className="h-16 bg-gray-800/50 animate-pulse"></div>
        <div className="container mx-auto px-4 py-8">
          <div className="h-8 bg-gray-700/50 rounded animate-pulse mb-4 w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-700/30 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

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

        {/* Debug Info - Hanya tampil di development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute top-6 left-6 z-50 bg-yellow-500/20 px-3 py-2 rounded-lg text-yellow-300 text-xs">
            <div>Debug: {isAdmin ? "ADMIN" : "USER"}</div>
            <div>Email: {userEmail}</div>
          </div>
        )}

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
