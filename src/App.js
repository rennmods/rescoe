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
import ErrorBoundary from "./components/ErrorBoundary";
import SeasonalTheme from "./components/SeasonalTheme";
import { teacher } from "./data";

function App() {
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState(null);
  const [view, setView] = useState("login");
  const [onlineCount, setOnlineCount] = useState(0);

  useEffect(() => {
    AOS.init({ 
      duration: 1000, 
      once: true,
      offset: 50
    });

    const setupSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session) {
        setUserEmail(session.user.email);
        await checkIfAdmin(session.user.id);
        setView("main");
        
        // Track user presence
        await trackUserPresence(session.user.id, 'online');
      }
      setLoading(false);
    };

    setupSession();

    // Real-time presence tracking
    const presenceChannel = supabase.channel('online-users')
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        setOnlineCount(Object.keys(state).length);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED' && session) {
          await presenceChannel.track({ 
            user_id: session.user.id,
            online_at: new Date().toISOString()
          });
        }
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session) {
        setUserEmail(session.user.email);
        await checkIfAdmin(session.user.id);
        setView("main");
        await trackUserPresence(session.user.id, 'online');
      } else {
        setIsAdmin(false);
        setUserEmail(null);
        setView("login");
      }
    });

    return () => {
      subscription.unsubscribe();
      if (session) {
        trackUserPresence(session.user.id, 'offline');
      }
      presenceChannel.unsubscribe();
    };
  }, [session]);

  const trackUserPresence = async (userId, status) => {
    await supabase
      .from('user_presence')
      .upsert({ 
        user_id: userId, 
        status: status,
        last_seen: new Date().toISOString()
      });
  };

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
    if (session) {
      await trackUserPresence(session.user.id, 'offline');
    }
    await supabase.auth.signOut();
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-xl font-semibold">Loading Rescoe Republika...</p>
          <p className="text-gray-400 mt-2">Mempersiapkan pengalaman terbaik</p>
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
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-30 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${10 + Math.random() * 20}s`
              }}
            />
          ))}
        </div>

        {/* Online Users & User Info */}
        <div className="absolute top-6 right-6 z-50 flex flex-col items-end space-y-3">
          <div className="flex items-center space-x-4">
            <div className="bg-green-500/20 px-3 py-1 rounded-full flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">{onlineCount} Online</span>
            </div>
            
            {userEmail && (
              <div className="bg-gray-800/70 px-4 py-2 rounded-xl text-sm shadow-lg backdrop-blur-sm border border-gray-700/50">
                <p className="text-white font-medium truncate max-w-xs">{userEmail}</p>
                <p className={`font-bold text-xs ${isAdmin ? 'text-cyan-400' : 'text-green-400'}`}>
                  {isAdmin ? "👑 Admin" : "⭐ Member"}
                </p>
              </div>
            )}
          </div>
          
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
