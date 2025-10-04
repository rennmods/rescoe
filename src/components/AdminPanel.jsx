import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import Swal from 'sweetalert2';

const AdminPanel = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  // Ambil daftar request foto pending
  const fetchRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('image_requests')
      .select('*')
      .eq('status', 'pending');
    
    if (!error) setRequests(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
    
    const channel = supabase
      .channel('image_requests_admin')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'image_requests' }, () => {
        fetchRequests();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Setujui foto
  const handleApprove = async (id, path) => {
    setProcessingId(id);
    try {
      const { data: fileData, error: downloadError } = await supabase.storage
        .from('pending_images')
        .download(path);
      if (downloadError) throw downloadError;

      const { error: uploadError } = await supabase.storage
        .from('approved_images')
        .upload(path, fileData);
      if (uploadError && uploadError.message !== 'The resource already exists') {
        throw uploadError;
      }

      const { error: updateError } = await supabase
        .from('image_requests')
        .update({ status: 'approved' })
        .eq('id', id);
      if (updateError) throw updateError;

      await supabase.storage.from('pending_images').remove([path]);

      Swal.fire('Berhasil!', 'Foto telah disetujui.', 'success');
    } catch (error) {
      Swal.fire('Oops!', 'Gagal menyetujui foto: ' + error.message, 'error');
    } finally {
      setProcessingId(null);
    }
  };

  // Tolak foto
  const handleReject = async (id, path) => {
    setProcessingId(id);
    try {
      await supabase.storage.from('pending_images').remove([path]);
      const { error: updateError } = await supabase
        .from('image_requests')
        .update({ status: 'rejected' })
        .eq('id', id);
      if (updateError) throw updateError;

      Swal.fire('Ditolak!', 'Foto telah ditolak.', 'info');
    } catch (error) {
      Swal.fire('Oops!', 'Gagal menolak foto: ' + error.message, 'error');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="my-12 space-y-12">
      {/* Bagian Approve Foto */}
      <div className="p-6 bg-gray-800/50 rounded-lg backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-white text-center mb-6">Request Foto (Admin)</h2>
        {loading ? (
          <p className="text-center my-8">Memuat permintaan...</p>
        ) : requests.length === 0 ? (
          <p className="text-center text-gray-400">Tidak ada permintaan foto baru.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {requests.map(req => {
              const imageUrl = supabase.storage.from('pending_images').getPublicUrl(req.image_path).data.publicUrl;
              const isProcessing = processingId === req.id;
              return (
                <div key={req.id} className="bg-gray-800 p-4 rounded-lg flex flex-col">
                  <img src={imageUrl} alt="request" className="w-full h-48 object-cover rounded-md mb-4"/>
                  <div className="flex justify-around mt-auto">
                    <button 
                      onClick={() => handleApprove(req.id, req.image_path)} 
                      className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition disabled:opacity-50"
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Memproses...' : 'Setujui'}
                    </button>
                    <button 
                      onClick={() => handleReject(req.id, req.image_path)} 
                      className="bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-700 transition disabled:opacity-50"
                      disabled={isProcessing}
                    >
                      Tolak
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bagian Manajemen User */}
      <UserManagement />
      
      {/* Bagian Promote to Admin */}
      <PromoteToAdmin />
    </div>
  );
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, role, created_at')
      .order('created_at', { ascending: false });

    if (!error) setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateRole = async (id, newRole) => {
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', id);

    if (error) {
      Swal.fire('Oops!', 'Gagal mengubah role: ' + error.message, 'error');
    } else {
      Swal.fire('Berhasil!', 'Role berhasil diperbarui.', 'success');
      fetchUsers();
    }
  };

  if (loading) return <p className="text-center">Memuat user...</p>;

  return (
    <div className="p-6 bg-gray-800/50 rounded-lg backdrop-blur-sm">
      <h2 className="text-2xl font-bold text-white text-center mb-6">Manajemen User</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-white">
          <thead>
            <tr className="bg-gray-700">
              <th className="py-2 px-3">Email</th>
              <th className="py-2 px-3">Role</th>
              <th className="py-2 px-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-gray-600">
                <td className="py-2 px-3">{u.email}</td>
                <td className="py-2 px-3 capitalize">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    u.role === 'admin' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="py-2 px-3">
                  {u.role !== 'admin' ? (
                    <button
                      onClick={() => updateRole(u.id, 'admin')}
                      className="bg-green-600 px-3 py-1 rounded hover:bg-green-700 transition text-sm"
                    >
                      Jadikan Admin
                    </button>
                  ) : (
                    <button
                      onClick={() => updateRole(u.id, 'user')}
                      className="bg-yellow-600 px-3 py-1 rounded hover:bg-yellow-700 transition text-sm"
                    >
                      Turunkan ke User
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const PromoteToAdmin = () => {
  const [email, setEmail] = useState('');
  const [promoting, setPromoting] = useState(false);

  const handlePromote = async () => {
    if (!email) {
      Swal.fire('Oops!', 'Email tidak boleh kosong', 'warning');
      return;
    }
    
    setPromoting(true);
    try {
      // Cari user by email
      const { data: users, error: userError } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('email', email);

      if (userError) throw userError;

      if (users.length === 0) {
        Swal.fire('Oops!', 'User tidak ditemukan!', 'error');
        return;
      }

      const userId = users[0].id;

      // Update role ke admin
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', userId);

      if (updateError) throw updateError;

      Swal.fire('Berhasil!', 'User berhasil di-promote menjadi admin!', 'success');
      setEmail('');
    } catch (error) {
      console.error('Error promoting user:', error);
      Swal.fire('Oops!', 'Gagal promote user: ' + error.message, 'error');
    } finally {
      setPromoting(false);
    }
  };

  return (
    <div className="p-6 bg-gray-800/50 rounded-lg backdrop-blur-sm">
      <h3 className="text-xl font-bold text-white mb-4">Promote User to Admin</h3>
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-gray-400 text-sm mb-2">Email User</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Masukkan email user"
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
          />
        </div>
        <button
          onClick={handlePromote}
          disabled={promoting || !email}
          className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold py-2 px-6 rounded-lg transition-colors"
        >
          {promoting ? 'Promoting...' : 'Promote to Admin'}
        </button>
      </div>
      <p className="text-gray-400 text-sm mt-2">
        💡 Masukkan email user yang ingin dijadikan admin
      </p>
    </div>
  );
};

export default AdminPanel;
