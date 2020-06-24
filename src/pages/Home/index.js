import React, { useState, useEffect } from "react"
import { Switch, Route, withRouter } from "react-router-dom"
import { useDispatch } from "react-redux"

import { AudioPlayer, Sidebar } from "components"
import { Likes } from "./Likes"
import { Playlists } from "./Playlists"

import { setSpotifyLikes, setSpotifyPlaylists } from "redux-app/actions"

import {
  checkSpotifyToken,
  setSpotifyAccessToken,
  getSpotifyLikes,
  getSpotifyPlaylists,
} from "utils/spotifyHelpers"

import {
  checkSoundCloudAccessToken,
  setSoundCloudTokenHeader,
} from "utils/soundcloudHelpers"

import "./style.scss"

const Home = (props) => {
  const dispatch = useDispatch()
  const [tokenLoader, setTokenLoader] = useState(true)

  useEffect(() => {
    const { userInfo } = props.userStore
    if (userInfo.services.includes("spotify")) {
      const token = checkSpotifyToken()
      setSpotifyAccessToken(token)

      getSpotifyLikes().then((likes) =>
        dispatch(
          setSpotifyLikes({
            spotifyLikes: likes,
          })
        )
      )

      getSpotifyPlaylists().then((playlists) => {
        dispatch(
          setSpotifyPlaylists({
            spotifyPlaylists: playlists,
          })
        )
      })
    }

    if (userInfo.services.includes("soundcloud")) {
      const token = checkSoundCloudAccessToken()
      setSoundCloudTokenHeader(token)
      console.log("hasss")
      // getSCUserLikedTracks(183)
    }

    props.history.push("/home/likes/spotify")
    setTokenLoader(false)
  }, [])

  if (tokenLoader) return <></>

  return (
    <>
      <Sidebar />
      <div className="music-app-home">
        <div className="music-app-home__container">
          <AudioPlayer />
          <Switch>
            <Route exact path="/home/likes/:service?">
              <Likes />
            </Route>
            <Route exact path="/home/playlists/:service?">
              <Playlists />
            </Route>
          </Switch>
        </div>
      </div>
    </>
  )
}

export default withRouter(Home)
