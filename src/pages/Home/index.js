import React, { useEffect } from "react"
import { Switch, Route, withRouter } from "react-router-dom"

import { AudioPlayer, Sidebar } from "components"

import { SPOTIFY_LOGIN_LINK } from "utils/spotifyHelpers"

import "./style.scss"

const Home = (props) => {
  useEffect(() => {
    props.history.push("/home/spotify")
  }, [])

  return (
    <>
      <Sidebar />
      {/* <AudioPlayer /> */}
      <div className="music-app-home">
        <div className="music-app-home__container">
          <a href={SPOTIFY_LOGIN_LINK}>Login Spotify</a>

          <Switch>
            <Route exact path="/home/spotify/:section?">
              <AudioPlayer />
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
