import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SpotifyWebApi from 'spotify-web-api-js';
import { authEndpoint, clientId, redirectUri, scopes } from './config';
import { hash } from './hash';
import Game from './Game';

const spotifyApi = new SpotifyWebApi();

function App() {
  const [token, setToken] = useState('');
  const [currentlyPlaying, setCurrentlyPlaying] = useState({});

  useEffect(() => {
    const _token = hash.access_token;
    if (_token) {
      setToken(_token);
      spotifyApi.setAccessToken(_token);
      getCurrentlyPlaying();
    }
  }, []);

  const getCurrentlyPlaying = () => {
    spotifyApi.getMyCurrentPlaybackState().then(response => {
      if (response && response.item) {
        setCurrentlyPlaying(response.item);
      }
    });
  };

  return (
    <div className="App">
      {!token && (
        <a
          href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
            '%20'
          )}&response_type=token&show_dialog=true`}
        >
          Login to Spotify
        </a>
      )}
      {token && currentlyPlaying && currentlyPlaying.name && (
        <div>
          <h1>Now Playing: {currentlyPlaying.name}</h1>
          {currentlyPlaying.artists && currentlyPlaying.artists[0] && (
            <h2>{currentlyPlaying.artists[0].name}</h2>
          )}
          <button onClick={getCurrentlyPlaying}>Refresh</button>
        </div>
      )}
      <Game />
    </div>
  );
}

export default App;
