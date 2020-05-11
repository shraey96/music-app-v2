import React from "react"

import { AudioPlayer, Sidebar } from "components"

import { SPOTIFY_LOGIN_LINK } from "utils/spotifyHelpers"

const Home = () => {
  return (
    <div className="music-app-home">
      <a href={SPOTIFY_LOGIN_LINK}>Login Spotify</a>
      <Sidebar />
      <AudioPlayer />
    </div>
  )
}

export default Home
