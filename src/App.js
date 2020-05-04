import React from "react"

import { AudioPlayer, Sidebar } from "components"

import { SPOTIFY_LOGIN_LINK } from "utils/spotifyHelpers"

class App extends React.Component {
  render() {
    return (
      <div className="spotify-player">
        <a href={SPOTIFY_LOGIN_LINK}>Login Spotify</a>
        <Sidebar />
        <AudioPlayer />
      </div>
    )
  }
}

export default App
