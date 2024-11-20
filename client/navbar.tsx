import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchVisible, setIsSearchVisible] = useState(false);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Search for:', searchTerm); 
        // Replace with search API when ready
    };

    return (
        <div className="navbar">
            <button onClick={handleLogout} className="logout-button">
                Logout
            </button>

            {!isSearchVisible ? (
                <button 
                    onClick={() => setIsSearchVisible(true)}
                    className="find-friends-button"
                >
                    Friends
                </button>
            ) : (
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
                    <button 
                        onClick={() => setIsSearchVisible(false)}
                        className="close-button"
                        aria-label="Close search"
                    >
                        X
                    </button>
                </form>
            )}
        </div>
    );
}
