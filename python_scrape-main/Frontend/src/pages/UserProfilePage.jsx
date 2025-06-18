// src/pages/UserProfilePage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserProfilePage.css';

function UserProfilePage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    fetch('http://localhost:8000/api/users/profile/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(data => {
        const joinedDate = new Date(data.date_joined).toLocaleDateString();
        setUser({ ...data, date_joined: joinedDate });
      })
      .catch(() => {
        localStorage.removeItem('authToken');
        navigate('/login');
      });
  }, [navigate]);

  const handleLogout = async () => {
    const token = localStorage.getItem("authToken");

    await fetch("http://localhost:8000/api/users/logout/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account? This cannot be undone.");
    if (!confirmDelete) return;

    const token = localStorage.getItem("authToken");

    try {
      const res = await fetch("http://localhost:8000/api/users/delete/", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        alert("Account deleted successfully.");
        localStorage.removeItem("authToken");
        navigate("/signup");
      } else {
        alert("Failed to delete account.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("An error occurred.");
    }
  };

  if (!user) return <div className="profile-container">Loading...</div>;

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-left">
          <i className="bi bi-person-circle profile-icon"></i>
        </div>
        <div className="profile-right">
          <h2>{user.username}'s Profile</h2>
          <div className="profile-info">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Date Joined:</strong> {user.date_joined}</p>
            <p><strong>Account Type:</strong> Regular User</p>
            <p><strong>User ID:</strong> {user.id}</p>
          </div>
          <div className="profile-actions">
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
            <button className="delete-btn" onClick={handleDelete}>Delete Account</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfilePage;
