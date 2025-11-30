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
    // fetch products for everyone (guest or logged in)
    fetchProducts();
  }, []);

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

  return (
    <div style={{ padding: 12 }}>
      {/* Guest Banner */}
      {!session && (
        <div style={{
          padding: 12,
          background: "#f5f5f5",
          border: "1px solid #ddd",
          borderRadius: 6,
          marginBottom: 16,
          textAlign: "center"
        }}>
          <p>You are viewing as a guest.</p>
          <p>
            <Link to="/login">Login</Link> or <Link to="/signup">Signup</Link> to sell products.
          </p>
        </div>
      )}

      <h2>All Products</h2>

      {loading && <div>Loading products...</div>}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
          marginTop: 12
        }}
      >
        {products.map((p) => {
          const publicUrl = supabase
            .storage
            .from('user-products')
            .getPublicUrl(p.image_path).data.publicUrl;

          return (
            <div
              key={p.id}
              onClick={() => setSelected(p)}
              style={{
                border: '1px solid #ddd',
                padding: 10,
                cursor: 'pointer',
                borderRadius: 6,
                background: "#fff",
                transition: "0.2s",
              }}
            >
              <img
                src={publicUrl}
                alt={p.name}
                style={{
                  width: '100%',
                  height: 150,
                  objectFit: 'cover',
                  borderRadius: 4,
                }}
              />
              <h4 style={{ marginTop: 8 }}>{p.name}</h4>
              <div style={{ fontWeight: 'bold' }}>₹{p.price}</div>
            </div>
          );
        })}

        {!loading && products.length === 0 && (
          <div>No products available.</div>
        )}
      </div>

      {/* Modal */}
      {selected && (
        <ProductModal
          product={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
