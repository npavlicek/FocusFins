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
        console.log('Search for:', searchTerm); 
        //^^^ Replace with search api when ready
    };

    return (
        <div className="navbar">
            <button onClick={handleLogout} className="logout-button">
                Logout
            </button>
            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    placeholder="Search for friends..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <button type="submit" className="search-button">
                    Search
                </button>
            </form>
        </div>
    );
}
