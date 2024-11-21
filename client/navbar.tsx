import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const songs = [
  { name: 'Focus Song 1', url: '//song1.mp3' },
  { name: 'Focus Song 2', url: 'https://example.com/song2.mp3' },
  { name: 'Focus Song 3', url: 'https://example.com/song3.mp3' },
];

function StudySounds() {
  const [isOpen, setIsOpen] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const handlePlay = (url: string) => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    const newAudio = new Audio(url);
    setAudio(newAudio);
    newAudio.play().catch((err) => {
      console.error('Playback failed:', err);
    });
  };


  return (
    <div className="studySoundsContainer">
      <button onClick={togglePopup} className="study-sounds-toggle-button">
        {isOpen ? 'Study Sounds' : 'Study Sounds'}
      </button>
      {isOpen && (
        <div className="studySoundsWrapper">
          <h3 className="titleSong">Study Sounds</h3>
          <ul className="studySoundsList">
            {songs.map((song, index) => (
              <li key={index} className="studySoundsListItem">
                <button onClick={() => handlePlay(song.url)}>{song.name}</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
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
            placeholder="Visit a friends reef..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            Visit
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

      {/* Study Sounds Popup */}
      <StudySounds />
    </div>
  );
}
