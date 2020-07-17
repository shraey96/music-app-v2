import React, { useState, useEffect } from "react"
import { Switch, Route, withRouter } from "react-router-dom"
import { useDispatch } from "react-redux"

import { AudioPlayer, Sidebar } from "components"
import { Likes } from "./Likes"
import { Playlists } from "./Playlists"

import { setSoundcloudLikes, setSoundcloudPlaylists } from "redux-app/actions"

import {
  setSpotifyAccessToken,
  getSpotifyLikes,
  getSpotifyPlaylists,
  checkSpotifyToken,
} from "utils/spotifyHelpers"

import {
  checkSoundCloudAccessToken,
  setSoundCloudTokenHeader,
  getSCMeLikedTracks,
  getPlaylistLikedExp,
  getPlaylistMe,
} from "utils/soundcloudHelpers"

import "./style.scss"

const Home = (props) => {
  const dispatch = useDispatch()
  const [tokenLoader, setTokenLoader] = useState(true)

  useEffect(() => {
    const { userInfo } = props.userStore
    if (userInfo.services.includes("spotify")) {
      const token = checkSpotifyToken()

      if (token) {
        setSpotifyAccessToken(token)

        getSpotifyLikes({ withDispatch: true })

        getSpotifyPlaylists({ withDispatch: true })
      } else {
        // dispatch error for token
      }
    }

    if (userInfo.services.includes("soundcloud")) {
      const token = checkSoundCloudAccessToken()
      if (token) {
        setSoundCloudTokenHeader(token)
        getSCMeLikedTracks().then((likes) => {
          console.log(2345, likes)
          dispatch(
            setSoundcloudLikes({
              soundcloudLikes: likes,
            })
          )
        })
        const uid = token.split("-")[2]
        Promise.all([getPlaylistMe(uid), getPlaylistLikedExp(uid)]).then(
          ([d1, d2]) => {
            const combinedList = [...d2.data.map((p) => p.playlist), d1.data[0]]

            dispatch(
              setSoundcloudPlaylists({
                soundcloudPlaylists: combinedList,
              })
            )
          }
        )
      } else {
        // dispatch error for token
      }
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
