import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Signup() {
  const { signUp } = useAuth();
  const nav = useNavigate();

  const [form, setForm] = useState({ email:'', password:'', full_name:'', phone:'' });
  const [error, setError] = useState(null);
  async function submit(e) {
    e.preventDefault();
    setError(null);
    try {
      await signUp(form);
      nav('/'); // or show verify email message
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={submit}>
      <h2>Sign up</h2>
      <input required placeholder="Full name" value={form.full_name} onChange={e=>setForm({...form, full_name: e.target.value})}/>
      <input required placeholder="Phone" value={form.phone} onChange={e=>setForm({...form, phone: e.target.value})}/>
      <input required type="email" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email: e.target.value})}/>
      <input required type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form, password: e.target.value})}/>
      <button type="submit">Sign up</button>
      {error && <div style={{color:'red'}}>{error}</div>}
    </form>
  );
}
