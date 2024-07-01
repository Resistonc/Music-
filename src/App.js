import React, { useEffect, useState } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import { authEndpoint, clientId, redirectUri, scopes } from './config';
import { hash } from './hash';
import './App.css';

const spotifyApi = new SpotifyWebApi();

function App() {
  const [token, setToken] = useState('');
  const [currentlyPlaying, setCurrentlyPlaying] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const _token = hash.access_token || localStorage.getItem('spotifyToken');
    console.log('Token:', _token);  // Debug: Log token to console

    if (_token) {
      if (hash.access_token) {
        localStorage.setItem('spotifyToken', hash.access_token);
      }
      setToken(_token);
      spotifyApi.setAccessToken(_token);
      getCurrentlyPlaying();

      const interval = setInterval(getCurrentlyPlaying, 5000);

      return () => clearInterval(interval);
    } else {
      console.log('No token found');  // Debug: Log if no token is found
    }
  }, []);

  const getCurrentlyPlaying = () => {
    if (!token) {
      setError('No token available');
      return;
    }

    spotifyApi.getMyCurrentPlaybackState()
      .then(response => {
        if (response && response.item) {
          setCurrentlyPlaying(response.item);
          setError(null); // Clear any previous errors
        } else {
          setCurrentlyPlaying({});
          setError('No song is currently playing.');
        }
      })
      .catch(error => {
        console.error('Error fetching currently playing track:', error);
        setError('Failed to fetch currently playing track.');
      });
  };

  const handleLogin = () => {
    window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
      '%20'
    )}&response_type=token&show_dialog=true`;
  };

  return (
    <div className="App">
      <button onClick={handleLogin} style={{ color: 'white', textDecoration: 'none' }}>
        Login to Spotify
      </button>
      {token && (
        <div className="currently-playing">
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {currentlyPlaying.name ? (
            <>
              <div className="song-info">
                <h1>Now Playing: {currentlyPlaying.name}</h1>
                {currentlyPlaying.artists && currentlyPlaying.artists.length > 0 && (
                  <h2>{currentlyPlaying.artists[0].name}</h2>
                )}
              </div>
              {currentlyPlaying.album && currentlyPlaying.album.images && currentlyPlaying.album.images.length > 0 && (
                <img src={currentlyPlaying.album.images[0].url} alt="Album cover" className="album-cover" />
              )}
            </>
          ) : (
            !error && <p>No song is currently playing.</p> // Ensure this only shows when there is no error
          )}
        </div>
      )}
    </div>
  );
}

export default App;
