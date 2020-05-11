import React, { useState, useEffect } from "react"
import { Switch, Route, withRouter } from "react-router-dom"

import { AudioPlayer, Sidebar } from "components"

import {
  checkSpotifyToken,
  setSpotifyAccessToken,
  SPOTIFY_LOGIN_LINK,
} from "utils/spotifyHelpers"

import "./style.scss"

const Home = (props) => {
  const [tokenLoader, setTokenLoader] = useState(true)

  useEffect(() => {
    const { userInfo } = props.userStore
    if (userInfo.services.includes("spotify")) {
      const token = checkSpotifyToken()
      setSpotifyAccessToken(token)
    }
    setTokenLoader(false)
  }, [])

  if (tokenLoader) return <></>

  return (
    <>
      <Sidebar />
      {/* <AudioPlayer /> */}
      <div className="music-app-home">
        <div className="music-app-home__container">
          <a href={SPOTIFY_LOGIN_LINK}>Login Spotify</a>
          <AudioPlayer />
          <Switch>
            <Route exact path="/home/spotify/:section?">
              <p>Spotify</p>
            </Route>
            <Route exact path="/home/soundcloud/:section?">
              <p>Soundcloud</p>
            </Route>
          </Switch>
        </div>
      </div>
    </>
  )
}

export default withRouter(Home)
