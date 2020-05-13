import React, { useEffect } from "react"

import { useSelector, useDispatch } from "react-redux"

import { BroadcastChannel } from "broadcast-channel"

import { playTrack, toggleAudioPlay } from "redux-app/actions"

import { playSpotifyTrack } from "utils/spotifyHelpers"

import "./style.scss"

const AudioPlayer = () => {
  const userStore = useSelector((state) => state.user)
  const playerState = useSelector((state) => state.player)
  const dispatch = useDispatch()

  let spotifyToken = null
  let spotifyPlayer = null

  useEffect(() => {
    if (userStore.userInfo.services.includes("spotify")) {
      checkSpotify()
    }
  }, [])

  const checkSpotify = () => {
    const storageSpotifyToken = JSON.parse(
      localStorage.getItem("spotify_creds") || false
    )

    const { access_token } = storageSpotifyToken

    spotifyToken = access_token
    bindSpotifyPlayer()
  }

  const bindSpotifyPlayer = () => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      spotifyPlayer = new window.Spotify.Player({
        name: "Spotify Now's App",
        getOAuthToken: (cb) => {
          cb(spotifyToken)
        },
      })

      spotifyPlayer.addListener("initialization_error", ({ message }) => {
        console.error(message)
      })
      spotifyPlayer.addListener("authentication_error", ({ message }) => {
        console.error(message)
      })
      spotifyPlayer.addListener("account_error", ({ message }) => {
        console.error(message)
      })
      spotifyPlayer.addListener("playback_error", ({ message }) => {
        console.error(message)
      })

      // Playback status updates
      spotifyPlayer.addListener("player_state_changed", (trackState) => {
        console.log(44, trackState)
        dispatch(toggleAudioPlay({ isAudioPlaying: !trackState.paused }))
        dispatch(
          playTrack({
            trackPayload: {
              service: "spotify",
              trackId: trackState.track_window.current_track.id,
              trackInfo: trackState.track_window.current_track,
            },
          })
        )
      })

      // Ready
      spotifyPlayer.addListener("ready", (d) => {
        console.log("Ready with Device ID", d, d.device_id)
      })

      // Not Ready
      spotifyPlayer.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id)
      })

      spotifyPlayer.connect()

      const spotifyChannel = new BroadcastChannel("SPOTIFY_PLAY_TRACK")
      spotifyChannel.onmessage = (msg) => {
        playSpotifyTrack({
          spotify_uri: msg.uri,
          playerInstance: spotifyPlayer,
        })
      }
    }
  }

  console.log(111, playerState)

  return (
    <>
      <div className="audio-player">
        <div className="audio-player__container">
          <div className="audio-player__container__meta">
            {/* img, title, artist */}
          </div>
          <div className="audio-player__container__controls">
            {/* play / pause / shuffle / repeat */}
          </div>
          <div className="audio-player__container__side">
            {/* timer, playlist, volume */}
          </div>
        </div>
      </div>
      {/* <audio
        src={}
        style={{ display: "none" }}
        ref={(ref) => (this.audioRef = ref)}
      /> */}
    </>
  )
}

export { AudioPlayer }
