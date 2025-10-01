import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Mail } from 'lucide-react';
import Swal from 'sweetalert2';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({ email });

      if (error) throw error;

      Swal.fire({
        title: 'Link Terkirim!',
        text: 'Silakan periksa kotak masuk email Anda untuk link login.',
        icon: 'success',
        background: '#1e2b3b',
        color: '#ffffff',
      });
    } catch (error) {
      Swal.fire('Oops!', error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="w-full max-w-sm p-8 bg-gray-800/50 rounded-lg shadow-lg backdrop-blur-sm text-center">
        <h1 className="text-3xl font-bold mb-2">Login</h1>
        <p className="text-gray-400 mb-8">
          Masukkan email Anda untuk mendapatkan link login.
        </p>

        <form onSubmit={handleLogin}>
          <div className="mb-6">
            <label htmlFor="email" className="sr-only">Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="text-gray-400" />
              </span>
              <input
                id="email"
                type="email"
                placeholder="email@anda.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-3 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg transition-transform duration-200 hover:scale-105 disabled:opacity-50"
          >
            {loading ? 'Mengirim...' : 'Kirim Magic Link'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
