import React, { useEffect, useRef, useState } from "react"

import { useSelector, useDispatch } from "react-redux"

import { BroadcastChannel } from "broadcast-channel"

import { playTrack, toggleAudioPlay, seekTrack } from "redux-app/actions"

import { playSpotifyTrack } from "utils/spotifyHelpers"

import { Timer } from "./Timer"

import "./style.scss"

export const AudioPlayer = () => {
  const userStore = useSelector((state) => state.user)
  const playerState = useSelector((state) => state.player)
  const dispatch = useDispatch()

  let spotifyToken = null
  let spotifyPlayer = null

  let spotifyPlayerTimerRef = useRef(null)
  let timerContainerRef = useRef(null)

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
      window.spotifyPlayer = spotifyPlayer
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
        // spotifyPlayerTimerRef.current.updateTimer(10)

        dispatch(toggleAudioPlay({ isAudioPlaying: !trackState.paused }))
        // dispatch(
        //   playTrack({
        //     trackPayload: {
        //       service: "spotify",
        //       trackId: trackState.track_window.current_track.id,
        //       trackInfo: trackState.track_window.current_track,
        //     },
        //     trackIndex: msg.trackIndex,
        //     playQueue: msg.playQueue,
        //   })
        // )
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
        console.log(222, msg)
        dispatch(
          playTrack({
            trackPayload: {
              service: "spotify",
              trackId: msg.trackId,
              trackInfo: msg.trackInfo,
            },
            trackIndex: msg.trackIndex,
            playQueue: msg.playQueue,
          })
        )
      }
    }
  }

  const getTrackInfo = () => {
    const { currentTrack } = playerState
    const { service, trackId, trackInfo } = currentTrack
    if (!trackId) return {}
    if (service === "spotify") {
      return {
        trackId: trackId,
        service: service,
        cover: trackInfo.album.images[0].url,
        title: trackInfo.name,
        duration: Math.ceil(trackInfo.duration_ms / 1000), //to covert in seconds//
        artists: trackInfo.artists.map((a) => a.name).join(", "),
      }
    }
  }

  const { currentTrack, isAudioPlaying } = playerState

  console.log(111, playerState)
  return (
    <>
      <div className="audio-player">
        <div className="audio-player__container">
          <div className="audio-player__container__meta">
            <img
              src={currentTrack.trackId ? getTrackInfo().cover : ""}
              alt=""
            />
            <div className="info">
              <p className="title text-ellipsis">{getTrackInfo().title}</p>
              <p className="artists text-ellipsis">{getTrackInfo().artists}</p>
            </div>
          </div>
          <div className="audio-player__container__controls">
            {/* play / pause / shuffle / repeat */}
          </div>
          <div className="audio-player__container__side">
            {/* timer, playlist, volume */}
            <div
              className="audio-player__container__side__timer"
              id="111"
              ref={timerContainerRef}
            />
          </div>
          {timerContainerRef.current && (
            <Timer
              ref={spotifyPlayerTimerRef}
              portalRef={timerContainerRef}
              service={getTrackInfo().service}
              duration={getTrackInfo().duration}
              trackId={getTrackInfo().trackId}
              isAudioPlaying={isAudioPlaying}
              spotifyPlayer={spotifyPlayer}
              onTrackEnd={() => dispatch(seekTrack("forward"))}
            />
          )}
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
