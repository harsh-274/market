import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Nav() {
  const { session, userProfile, signOut } = useAuth();

  return (
    <nav style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "12px 20px",
      borderBottom: "1px solid #ddd",
      marginBottom: 20
    }}>
      <div>
        <Link to="/" style={{ fontSize: 22, fontWeight: "bold", textDecoration: "none" }}>
          Marketplace
        </Link>
      </div>

      <div style={{ display: "flex", gap: 15 }}>
        <Link to="/" style={{ textDecoration: "none" }}>Home</Link>

        {session ? (
          <>
            <Link to="/sell" style={{ textDecoration: "none" }}>Sell</Link>
            <span>Hi, {userProfile?.full_name}</span>
            <button onClick={signOut}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ textDecoration: "none" }}>Login</Link>
            <Link to="/signup" style={{ textDecoration: "none" }}>Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}
