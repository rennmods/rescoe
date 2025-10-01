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
                <td className="py-2 px-3 capitalize">{u.role}</td>
                <td className="py-2 px-3">
                  {u.role !== 'admin' ? (
                    <button
                      onClick={() => updateRole(u.id, 'admin')}
                      className="bg-green-600 px-3 py-1 rounded hover:bg-green-700 transition"
                    >
                      Jadikan Admin
                    </button>
                  ) : (
                    <button
                      onClick={() => updateRole(u.id, 'user')}
                      className="bg-yellow-600 px-3 py-1 rounded hover:bg-yellow-700 transition"
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

export default AdminPanel;
