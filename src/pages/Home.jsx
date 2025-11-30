import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../AuthContext';
import { Link } from 'react-router-dom';
import ProductModal from '../components/ProductModal';

export default function Home() {
  const { session } = useAuth();
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // fetch only when session is available
    if (session) {
      fetchProducts();
      // optional: subscribe to realtime changes for products additions
      // const subscription = supabase
      //   .channel('public:products')
      //   .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'products' }, payload => {
      //     // refetch or append
      //     fetchProducts();
      //   })
      //   .subscribe();
      // return () => supabase.removeChannel(subscription);
    } else {
      // clear products when logged out
      setProducts([]);
    }
  }, [session]);

  async function fetchProducts() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, image_path, details, seller_id, created_at')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('fetchProducts error', err);
    } finally {
      setLoading(false);
    }
  }

  // if not logged in: show Login/Signup CTA (assignment requirement)
  if (!session) {
    return (
      <div style={{ textAlign: 'center', paddingTop: 80 }}>
        <h2>Welcome to Circle Marketplace</h2>
        <p>Please login to browse & sell products.</p>
        <Link to="/login"><button style={{ marginRight: 10 }}>Login</button></Link>
        <Link to="/signup"><button>Signup</button></Link>
      </div>
    );
  }

  return (
    <div style={{padding: 12}}>
      <h2>All Products</h2>
      {loading && <div>Loading products...</div>}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:12}}>
        {products.map(p => (
          <div key={p.id} onClick={() => setSelected(p)} style={{border:'1px solid #ddd',padding:10,cursor:'pointer'}}>
            <img src={supabase.storage.from('user-products').getPublicUrl(p.image_path).data.publicUrl}
                 alt={p.name}
                 style={{width:'100%',height:140,objectFit:'cover'}} />
            <h4>{p.name}</h4>
            <div>₹{p.price}</div>
          </div>
        ))}
        {products.length === 0 && !loading && <div>No products yet. Try listing one from /sell</div>}
      </div>

      {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
