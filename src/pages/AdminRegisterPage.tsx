import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminRegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(name, email, password, 'admin');
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={submit} className="w-full max-w-md p-6 bg-card rounded shadow">
        <h2 className="text-xl font-bold mb-4">Admin Create account</h2>
        {error && <div className="text-sm text-destructive mb-2">{error}</div>}
        <label className="block mb-2">Full name</label>
        <input className="input w-full mb-3" value={name} onChange={(e) => setName(e.target.value)} />
        <label className="block mb-2">Email</label>
        <input className="input w-full mb-3" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label className="block mb-2">Password</label>
        <input type="password" className="input w-full mb-4" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="btn btn-primary w-full" type="submit">Create account</button>
      </form>
    </div>
  );
};

export default AdminRegisterPage;
