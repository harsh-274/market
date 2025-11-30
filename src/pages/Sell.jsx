import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Sell() {
  const { userProfile, session } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name:'', price:'', details:'' });
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  // If not logged in, redirect to login (extra safety)
  if (!session) {
    nav('/login', { replace: true });
    return null;
  }

  // If logged in but profile not yet loaded, show wait message
  if (!userProfile) {
    return <div style={{padding:40}}>Loading profile... please wait a moment.</div>;
  }

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) return setStatus('Attach an image');
    setStatus('');
    setLoading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;
      const filePath = `${userProfile.id}/${fileName}`;

      // upload to storage
      const { error: upErr } = await supabase.storage
        .from('user-products')
        .upload(filePath, file, {cacheControl: '3600', upsert: false});

      if (upErr) throw upErr;

      // insert product row
      const { error: dbErr } = await supabase
        .from('products')
        .insert([{
          name: form.name,
          price: form.price,
          image_path: filePath,
          seller_id: userProfile.id,
          details: form.details
        }]);

      if (dbErr) throw dbErr;

      setStatus('Product listed!');
      setForm({ name:'', price:'', details:'' });
      setFile(null);
    } catch (err) {
      setStatus('Error: ' + (err.message || JSON.stringify(err)));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleUpload} style={{maxWidth:720, margin:'24px auto', display:'flex', flexDirection:'column', gap:8}}>
      <h2>Sell a product</h2>
      <div>Seller: <strong>{userProfile.full_name}</strong> | Phone: {userProfile.phone}</div>

      <input required placeholder="Product name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
      <input required placeholder="Price" value={form.price} onChange={e=>setForm({...form, price:e.target.value})}/>
      <textarea placeholder="Details" value={form.details} onChange={e=>setForm({...form, details:e.target.value})}/>

      <label style={{display:'flex',gap:8,alignItems:'center'}}>
        <input type="file" accept="image/*" onChange={e=>setFile(e.target.files[0])}/>
        <span>{file ? file.name : 'No file chosen'}</span>
      </label>

      <button type="submit" disabled={loading}>{loading ? 'Uploading...' : 'Upload & List'}</button>

      <div style={{marginTop:8}}>{status}</div>
    </form>
  );
}
