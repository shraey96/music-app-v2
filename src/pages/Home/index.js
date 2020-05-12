import React, { useState, useEffect } from "react"
import { Switch, Route, withRouter } from "react-router-dom"
import { useDispatch } from "react-redux"

import { AudioPlayer, Sidebar } from "components"
import { Likes } from "./Likes"

import { setSpotifyLikes } from "redux-app/actions"

import {
  checkSpotifyToken,
  setSpotifyAccessToken,
  getSpotifyLikes,
} from "utils/spotifyHelpers"

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
    }
    props.history.push("/home/likes/spotify")
    setTokenLoader(false)
  }, [])

  if (tokenLoader) return <></>

  return (
    <>
      <Sidebar />
      {/* <AudioPlayer /> */}
      <div className="music-app-home">
        <div className="music-app-home__container">
          <AudioPlayer />

          <Route exact path="/home/likes/:service?">
            <Likes />
          </Route>
        </div>
      </div>
    </>
  )
}

export default withRouter(Home)
