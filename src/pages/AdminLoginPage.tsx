import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminLoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password, 'admin');
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={submit} className="w-full max-w-md p-6 bg-card rounded shadow">
        <h2 className="text-xl font-bold mb-4">Admin Sign in</h2>
        {error && <div className="text-sm text-destructive mb-2">{error}</div>}
        <label className="block mb-2">Email</label>
        <input className="input w-full mb-3" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label className="block mb-2">Password</label>
        <input type="password" className="input w-full mb-4" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="btn btn-primary w-full" type="submit">Sign in</button>
        <div className="mt-4">
          <div className="flex items-center gap-2 my-3">
            <div className="flex-1 h-px bg-border"></div>
            <div className="text-sm text-muted-foreground">or</div>
            <div className="flex-1 h-px bg-border"></div>
          </div>
          <button
            type="button"
            className="w-full border rounded py-2 flex items-center justify-center gap-2"
            onClick={() => { window.location.href = '/api/auth/google?role=admin'; }}
          >
            <span className="font-medium">Sign in with Google</span>
          </button>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>Back</button>
          <div className="text-sm">
            Don't have an admin account? <a href="/admin/register" className="text-primary font-semibold">Create admin</a>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminLoginPage;
