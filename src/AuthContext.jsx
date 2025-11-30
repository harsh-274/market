import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const s = supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
      setLoading(false);
      if (data.session?.user) fetchProfile(data.session.user.id);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess?.session ?? null);
      if (sess?.session?.user) fetchProfile(sess.session.user.id);
      else setUserProfile(null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (!error) setUserProfile(data);
  }

  async function signUp({ email, password, full_name, phone }) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    // create profile row
    const userId = data.user.id;
    await supabase.from('profiles').insert([{ id: userId, full_name, phone }]);
    return data;
  }

  // inside AuthContext.jsx (replace existing signIn function)
  async function signIn({ email, password }) {
    // signInWithPassword returns session data on success
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    // if we have a session and user id, fetch profile immediately
    const userId = data?.user?.id;
    if (userId) {
      await fetchProfile(userId); // ensure userProfile is available ASAP
      setSession(data.session ?? null);
    }
    return data;
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUserProfile(null);
    setSession(null);
  }

  return (
    <AuthContext.Provider value={{ session, userProfile, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
