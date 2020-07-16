import React, { useEffect, useRef } from "react"

import { useSelector, useDispatch } from "react-redux"

import { motion } from "framer-motion"

import { BroadcastChannel } from "broadcast-channel"

import { EllipsisScroll } from "components"

import {
  playTrack,
  toggleAudioPlay,
  seekTrack,
  toggleShuffle,
} from "redux-app/actions"

import { playSpotifyTrack } from "utils/spotifyHelpers"
import { getSoundCloudTrackStreamURL } from "utils/soundcloudHelpers"

import { ICONS } from "../../iconConstants"

import { Timer, QueueView, VolumeSlider } from "./AudioPlayerMisc"

import "./style.scss"

const spotifyChannel = new BroadcastChannel("SPOTIFY_CHANNEL")

export const AudioPlayer = () => {
  const userStore = useSelector((state) => state.user)
  const playerState = useSelector((state) => state.player)
  const dispatch = useDispatch()

  const timerContainerRef = useRef(null)
  const audioTagRef = useRef(null)

  const prevPlayerTrackId = useRef(null)

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
      document.querySelector("#player_audio_tag").pause()
      if (prevPlayerTrackId.current !== currentTrack.trackId) {
        console.log(666666, currentTrack.trackId)
        playSpotifyTrack({
          spotify_uri: `spotify:track:${currentTrack.trackId}`,
          playerInstance: window.spotifyPlayer,
        })
        prevPlayerTrackId.current = currentTrack.trackId
      }
    }
    if (currentTrack.service === "soundcloud") {
      window.spotifyPlayer && window.spotifyPlayer.pause()
      if (prevPlayerTrackId.current !== currentTrack.trackId) {
        const audioTagDOM = document.querySelector("#player_audio_tag")
        console.log(9999)
        if (audioTagDOM) {
          getSoundCloudTrackStreamURL(currentTrack.trackInfo).then(
            (streamURL) => {
              if (streamURL) {
                audioTagDOM.src = streamURL
                audioTagDOM.play()
                prevPlayerTrackId.current = currentTrack.trackId
              }
            }
          )
        }
      }
    }
  }, [
    playerState.currentTrack.service,
    playerState.currentTrack.trackId,
    playerState.isAudioPlaying,
  ])

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
        console.log(44, trackState, 10101010, playerState)

        if (playerState.currentTrack.service === "spotify") {
          dispatch(toggleAudioPlay({ isAudioPlaying: !trackState.paused }))
          const currentTrack = trackState.track_window.current_track
          if (prevPlayerTrackId.current !== currentTrack.id) {
            const trackPayload = {
              service: "spotify",
              trackId: currentTrack.id,
              trackInfo: currentTrack,
            }
            dispatch(
              playTrack({
                isAudioPlaying: false,
                trackPayload,
                trackIndex: 0,
                playQueue: [trackPayload],
              })
            )
          }
        }
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

      spotifyChannel.onmessage = (msg) => {
        if (msg.type === "playTrack") {
          if (prevPlayerTrackId.current === msg.trackId) {
            window.spotifyPlayer.togglePlay()
          } else {
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
        if (msg.type === "togglePlayPause") {
          // handlePlayPause()
        }
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
    if (service === "soundcloud") {
      return {
        trackId: trackId,
        service: service,
        cover: (trackInfo.artwork_url || trackInfo.user.avatar_url).replace(
          "large.jpg",
          "t500x500.jpg"
        ),
        title: trackInfo.title,
        duration: Math.ceil(trackInfo.duration / 1000), //to covert in seconds//
        artists: trackInfo.user.username,
      }
    }
  }

  const handlePlayPause = () => {
    const { currentTrack, isAudioPlaying } = playerState
    if (currentTrack.service === "spotify") {
      window.spotifyPlayer.togglePlay()
    }
    if (currentTrack.service === "soundcloud") {
      const audioTagDOM = document.querySelector("#player_audio_tag")

      if (isAudioPlaying) {
        audioTagDOM.pause()
      } else {
        audioTagDOM.play()
      }
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

  console.log(111, playerState, prevPlayerTrackId.current)
  return (
    <>
      <motion.div
        initial={{ y: 80 }}
        animate={{ y: 0 }}
        transition={{ delay: 1.5 }}
        className="audio-player"
      >
        <div className="audio-player__container">
          <div className="audio-player__container__meta">
            <motion.img
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              key={getTrackInfo().trackId}
              src={currentTrack.trackId ? getTrackInfo().cover : ""}
              alt=""
            />
            <div className="info">
              <EllipsisScroll classNames="title" text={getTrackInfo().title} />
              <EllipsisScroll
                classNames="artists"
                text={getTrackInfo().artists}
              />
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
              {/* <QueueView /> */}
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
              onAudioTagStatusChange={() => handlePlayPause()}
            />
          )}
        </div>
      </motion.div>
    </>
  )
}
