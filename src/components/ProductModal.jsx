import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function ProductModal({ product, onClose }) {
  const [seller, setSeller] = useState(null);

  useEffect(() => {
    async function getSeller(){
      const { data } = await supabase.from('profiles').select('full_name, phone').eq('id', product.seller_id).single();
      setSeller(data);
    }
    getSeller();
  }, [product]);

  return (
    <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center'}}>
      <div style={{background:'#fff', padding:20, width:600, maxWidth:'95%'}}>
        <button onClick={onClose} style={{float:'right'}}>Close</button>
        <img src={supabase.storage.from('user-products').getPublicUrl(product.image_path).data.publicUrl} alt={product.name} style={{width:'100%', height:300, objectFit:'cover'}}/>
        <h3>{product.name}</h3>
        <p>{product.details}</p>
        <p>Price: ₹{product.price}</p>
        <hr/>
        {seller ? (
          <>
            <p>Seller: {seller.full_name}</p>
            <p>Phone: {seller.phone}</p>
          </>
        ) : <p>Loading seller...</p>}
      </div>
    </div>
  );
}
