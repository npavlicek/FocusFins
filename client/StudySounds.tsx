import React, { useState } from 'react';

const songs = [
  { name: 'Focus Song 1', url: './public/song1.mp3' },
  { name: 'Focus Song 2', url: './public/song2.mp3' },
  { name: 'Focus Song 3', url: './public/song3.mp3' },
];

export default function StudySounds() {
  const [isOpen, setIsOpen] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const handlePlay = (index: number) => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    const newAudio = new Audio(`./public/song${index}.mp3`);
    newAudio.loop = true; // Enable looping
    setAudio(newAudio);
    newAudio
      .play()
      .then(() => setIsPlaying(true))
      .catch((err) => {
        console.error('Playback failed:', err);
      });
  };

  const togglePlayPause = () => {
    if (audio) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play().catch((err) => {
          console.error('Playback failed:', err);
        });
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="studySoundsContainer">
      <button onClick={togglePopup} className="study-sounds-toggle-button">
        {isOpen ? 'Close Study Sounds' : 'Study Sounds'}
      </button>
      {isOpen && (
        <div className="studySoundsWrapper">
          <h3 className="titleSong">Study Sounds</h3>
          <ul className="studySoundsList">
            {songs.map((song, index) => (
              <li key={index} className="studySoundsListItem">
                <button onClick={() => handlePlay(index + 1)}>{song.name}</button>
              </li>
            ))}
          </ul>
          {audio && (
            <button
              onClick={togglePlayPause}
              className={`play-pause-button ${isPlaying ? 'pause' : 'play'}`}
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
