import React, { useState } from "react";
import { supabase } from "../supabaseClient";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState("login"); 
  // "login" | "signup" | "reset"

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) setError(error.message);
    else window.location.reload();
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) setError(error.message);
    else alert("Akun berhasil dibuat! Silakan login.");
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`, 
    });

    if (error) setError(error.message);
    else alert("Link reset password sudah dikirim ke email kamu!");
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          {mode === "login"
            ? "Login"
            : mode === "signup"
            ? "Register"
            : "Reset Password"}
        </h2>

        <form className="space-y-4">
          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 rounded bg-gray-700 text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password hanya untuk login & signup */}
          {(mode === "login" || mode === "signup") && (
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 rounded bg-gray-700 text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          )}

          {/* Error message */}
          {error && <p className="text-red-400 text-sm">{error}</p>}

          {/* Button utama */}
          {mode === "login" && (
            <button
              onClick={handleLogin}
              className="w-full bg-cyan-600 hover:bg-cyan-700 py-2 rounded text-white font-semibold"
            >
              Login
            </button>
          )}

          {mode === "signup" && (
            <button
              onClick={handleSignup}
              className="w-full bg-green-600 hover:bg-green-700 py-2 rounded text-white font-semibold"
            >
              Register
            </button>
          )}

          {mode === "reset" && (
            <button
              onClick={handleResetPassword}
              className="w-full bg-yellow-600 hover:bg-yellow-700 py-2 rounded text-white font-semibold"
            >
              Kirim Link Reset
            </button>
          )}
        </form>

        {/* Navigasi mode */}
        <div className="mt-6 text-center text-gray-400 text-sm space-y-2">
          {mode !== "login" && (
            <p>
              Sudah punya akun?{" "}
              <button
                className="text-cyan-400 hover:underline"
                onClick={() => setMode("login")}
              >
                Login
              </button>
            </p>
          )}
          {mode !== "signup" && (
            <p>
              Belum punya akun?{" "}
              <button
                className="text-green-400 hover:underline"
                onClick={() => setMode("signup")}
              >
                Register
              </button>
            </p>
          )}
          {mode !== "reset" && (
            <p>
              Lupa password?{" "}
              <button
                className="text-yellow-400 hover:underline"
                onClick={() => setMode("reset")}
              >
                Reset
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
