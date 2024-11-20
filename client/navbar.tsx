import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const handleSearch = (e: any) => {
        e.preventDefault();
        navigate(`/visitReef?username=${searchTerm}`);
    };

    return (
        <div className="navbar">
            <button onClick={handleLogout} className="logout-button">
                Logout
            </button>
            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    placeholder="Visit a friends reef..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <button type="submit" className="search-button">
                    Visit
                </button>
            </form>
        </div>
    );
}
