import React, { useEffect, useState } from 'react';
import alanBtn from '@alan-ai/alan-sdk-web';
import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();

function App() {
  const [token, setToken] = useState('');
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    const hash = window.location.hash
      .substring(1)
      .split("&")
      .reduce((acc, item) => {
        const [k, v] = item.split("=");
        acc[k] = decodeURIComponent(v);
        return acc;
      }, {});
    window.location.hash = "";
    if (hash.access_token) {
      setToken(hash.access_token);
      spotifyApi.setAccessToken(hash.access_token);
    }

    alanBtn({
      key: 'YOUR_ALAN_SDK_KEY/from-Alan‑Studio',
      onCommand: ({ command, query }) => {
        if (command === 'play') {
          if (query) {
            spotifyApi.searchTracks(query).then(res => {
              const uri = res.tracks.items[0]?.uri;
              if (uri) spotifyApi.play({ uris: [uri] });
            });
          } else {
            spotifyApi.play();
          }
        } else if (command === 'pause') {
          spotifyApi.pause();
        } else if (command === 'next') {
          spotifyApi.skipToNext();
        }
      },
    });
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      {!token ? (
        <a
          href={
            'https://accounts.spotify.com/authorize' +
            '?client_id=YOUR_SPOTIFY_CLIENT_ID' +
            '&response_type=token' +
            '&redirect_uri=' + encodeURIComponent(window.location.href) +
            '&scope=streaming user-read-playback-state user-modify-playback-state user-read-private'
          }
        >
          Log in with Spotify
        </a>
      ) : (
        <h2>Say "Play [song]" or "Pause"</h2>
      )}
    </div>
  );
}

export default App;
