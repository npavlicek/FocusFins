import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const songs = [
  { name: 'Focus Song 1', url: '/public/song1.mp3' }, // Place this in the public folder
  { name: 'Focus Song 2', url: 'https://example.com/song2.mp3' },
  { name: 'Focus Song 3', url: 'https://example.com/song3.mp3' },
];

function StudySoundsPopup({ isVisible, onClose }: { isVisible: boolean; onClose: () => void }) {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const handlePlay = (url: string) => {
    if (audio) {
      audio.pause(); // Stop the currently playing audio
      audio.currentTime = 0; // Reset playback position
    }
    const newAudio = new Audio(url);
    setAudio(newAudio);
    newAudio.play().catch((err) => {
      console.error('Playback failed:', err);
    });
  };

  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause(); // Pause audio when the component is unmounted
        setAudio(null);
      }
    };
  }, [audio]);

  if (!isVisible) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Study Sounds</h2>
        <ul>
          {songs.map((song, index) => (
            <li key={index}>
              <button onClick={() => handlePlay(song.url)}>{song.name}</button>
            </li>
          ))}
        </ul>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default function Navbar() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search for:', searchTerm);
  };

  const handleTogglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
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

      <button onClick={handleTogglePopup} className="study-sounds-button">
        Study Sounds
      </button>

      <StudySoundsPopup isVisible={isPopupVisible} onClose={handleTogglePopup} />
    </div>
  );
}
