import React, { useEffect, useRef, useState } from "react"

import { useSelector, useDispatch } from "react-redux"

import { BroadcastChannel } from "broadcast-channel"

import {
  playTrack,
  toggleAudioPlay,
  seekTrack,
  toggleShuffle,
} from "redux-app/actions"

import { playSpotifyTrack } from "utils/spotifyHelpers"

import { ICONS } from "../../iconConstants"

import { Timer, QueueView, VolumeSlider } from "./AudioPlayerMisc"

import "./style.scss"

export const AudioPlayer = () => {
  const userStore = useSelector((state) => state.user)
  const playerState = useSelector((state) => state.player)
  const dispatch = useDispatch()

  const timerContainerRef = useRef(null)
  const audioTagRef = useRef(null)

  const checkSpotify = () => {
    const storageSpotifyToken = JSON.parse(
      localStorage.getItem("spotify_creds") || false
    )
    const { access_token } = storageSpotifyToken

    bindSpotifyPlayer(access_token)
  }

  const handleKeyDown = (e) => {
    if (e.keyCode === 32) {
      handlePlayPause()
    }
    if (e.ctrlKey) {
      e.keyCode === 39 && seekPlayerTrack("forward")
      e.keyCode === 37 && seekPlayerTrack("previous")
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    if (userStore.userInfo.services.includes("spotify")) {
      checkSpotify()
    }
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    const { currentTrack } = playerState
    if (currentTrack.service === "spotify") {
      playSpotifyTrack({
        spotify_uri: `spotify:track:${currentTrack.trackId}`,
        playerInstance: window.spotifyPlayer,
      })
    }
  }, [playerState.currentTrack.service, playerState.currentTrack.trackId])

  const bindSpotifyPlayer = (spotifyToken) => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      const spotifyPlayer = new window.Spotify.Player({
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

        dispatch(toggleAudioPlay({ isAudioPlaying: !trackState.paused }))
      })

      // Ready
      spotifyPlayer.addListener("ready", (d) => {
        console.log("Ready with Device ID", d, d.device_id)
      })

      // Not Ready
      spotifyPlayer.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id)
        dispatch(toggleAudioPlay({ isAudioPlaying: false }))
      })

      spotifyPlayer.connect()

      const spotifyChannel = new BroadcastChannel("SPOTIFY_PLAY_TRACK")
      spotifyChannel.onmessage = (msg) => {
        dispatch(
          playTrack({
            isAudioPlaying: false,
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

  const handlePlayPause = () => {
    const { currentTrack, isAudioPlaying } = playerState
    console.log(9090, isAudioPlaying, playerState.isAudioPlaying)
    dispatch(toggleAudioPlay({ isAudioPlaying: !isAudioPlaying }))
    if (currentTrack.service === "spotify") {
      window.spotifyPlayer.togglePlay()
    }
    if (currentTrack.service === "soundcloud") {
      isAudioPlaying ? audioTagRef.current.pause() : audioTagRef.current.play()
    }
  }

  const seekPlayerTrack = (type = "forward") => {
    dispatch(seekTrack(type))
  }

  const {
    currentTrack,
    isAudioPlaying,
    isRepeatMode,
    isShuffleMode,
  } = playerState

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
            <span
              className={`player-icon list-control-icon ${
                isShuffleMode && "player-icon--active"
              }`}
              onClick={() => dispatch(toggleShuffle(!isShuffleMode))}
            >
              {ICONS.SHUFFLE}
            </span>
            <div className="player-controls">
              <span
                className="player-icon seek-icon seek-icon--backwards"
                onClick={() => seekPlayerTrack("previous")}
              >
                {ICONS.SKIP_PREV}
              </span>
              <span
                className={`player-icon control-icon control-icon--${
                  isAudioPlaying ? "play" : "pause"
                }`}
                onClick={() => handlePlayPause()}
              >
                {isAudioPlaying ? ICONS.PAUSE_CIRCLE : ICONS.PLAY_CIRCLE}
              </span>
              <span
                className="player-icon seek-icon seek-icon--backwards"
                onClick={() => seekPlayerTrack("forward")}
              >
                {ICONS.SKIP_NEXT}
              </span>
            </div>
            <span
              className={`player-icon list-control-icon ${
                (isRepeatMode === 1 || isRepeatMode === 2) &&
                "list-control-icon--active"
              }`}
            >
              {ICONS.REPEAT}
            </span>
          </div>
          <div className="audio-player__container__side">
            <div
              className="audio-player__container__side__timer"
              id="111"
              ref={timerContainerRef}
            />
            <div className="side-controls">
              <QueueView />
              <VolumeSlider />
            </div>
          </div>
          {timerContainerRef.current && (
            <Timer
              portalRef={timerContainerRef}
              service={getTrackInfo().service}
              duration={getTrackInfo().duration}
              trackId={getTrackInfo().trackId}
              isAudioPlaying={isAudioPlaying}
              onTrackEnd={() => seekPlayerTrack("forward")}
            />
          )}
        </div>
      </div>
      <audio
        src={""}
        id="player-audio-tag"
        style={{ display: "none" }}
        ref={audioTagRef}
      />
    </>
  )
}
