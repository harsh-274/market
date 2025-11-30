import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Login() {
  const { signIn } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email:'', password:'' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      await signIn(form);
      setSuccess('Login successful — redirecting...');
      // small delay for UX so user sees message, then redirect
      setTimeout(() => {
        nav('/');
      }, 700);
    } catch (err) {
      if (err?.message?.includes('Email not confirmed')) {
        setError('Please verify your email. Check inbox & spam folder.');
      } else {
        setError(err.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} style={{maxWidth:420, margin:'40px auto', display:'flex', flexDirection:'column', gap:8}}>
      <h2>Login</h2>
      <input required type="email" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/>
      <input required type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})}/>
      <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>

      {success && <div style={{color:'green', marginTop:8}}>{success}</div>}
      {error && <div style={{color:'red', marginTop:8}}>{error}</div>}
    </form>
  );
}
