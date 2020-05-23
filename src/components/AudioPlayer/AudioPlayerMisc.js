import React, { useState, useEffect } from "react"
import ReactDOM from "react-dom"

import { useSelector } from "react-redux"

import { formatAudioTime } from "utils/helpers"

import { ICONS } from "iconConstants"

export const QueueView = () => {
  const [isQueueViewOpen, toggleQueueView] = useState(false)
  const playerState = useSelector((state) => state.player)
  const { playQueue } = playerState
  console.log(playQueue)
  return (
    <div className="queue-container">
      <span
        className={`player-icon queue-icon ${
          isQueueViewOpen && "queue-icon--active"
        }`}
        onClick={() => toggleQueueView((wasOpen) => !wasOpen)}
      >
        {ICONS.QUEUE}
      </span>
      <div className="queue-container__tracks">
        {playQueue.map((t) => {
          return (
            <div className="" key={t.id}>
              {t.name}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export const VolumeSlider = () => {
  const [currentVolume, setCurrentVolume] = useState(0)
  const currentTrack = useSelector((state) => state.player.currentTrack)

  useEffect(() => {
    if (currentTrack.service === "spotify") {
      window.spotifyPlayer
        .getVolume()
        .then((volume) => setCurrentVolume(volume))
    } else {
      setCurrentVolume(toggleAudioTagVolume("get"))
    }
  }, [currentTrack])

  const changeVolume = (volume) => {
    if (currentTrack.service === "spotify") {
      window.spotifyPlayer.setVolume(volume)
    }

    setCurrentVolume(volume)
    toggleAudioTagVolume("set", volume)
  }

  const toggleAudioTagVolume = (type, volume) => {
    const audioTag = document.querySelector("#player-audio-tag")
    if (audioTag) {
      if (type === "get") return audioTag.volume
      if (type === "set") audioTag.volume = volume
    }
    return 0
  }

  return (
    <div className="volume-container">
      <span className="player-icon volume-icon">
        {currentVolume === 0
          ? ICONS.VOL_MUTE
          : currentVolume < 0.55
          ? ICONS.VOL_LOW
          : ICONS.VOL_HIGH}
      </span>
      <div className="volume-slider">
        <input
          className="volume-slider"
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={currentVolume}
          onChange={(e) => changeVolume(e.target.value)}
        />
      </div>
    </div>
  )
}

export const Timer = (props) => {
  const {
    duration,
    trackId,
    isAudioPlaying,
    service,
    portalRef,
    onTrackEnd,
  } = props
  const [currentTime, setCurrentTime] = useState(0)
  const [timerInterval, setTimerInterval] = useState(null)

  useEffect(() => {
    return () => stopTimer()
  }, [])

  useEffect(() => {
    console.log("isAudioPlaying ===> ", isAudioPlaying)
    if (isAudioPlaying) {
      console.log("====> start")
      startTimer()
    } else {
      console.log("====> stop")
      stopTimer()
    }
  }, [isAudioPlaying])

  useEffect(() => {
    if (trackId) {
      console.log("====> reset")
      resetTimer()
    }
  }, [trackId])

  useEffect(() => {
    if (currentTime >= duration) {
      stopTimer()
      resetTimer()
      onTrackEnd && onTrackEnd(trackId)
    }
  }, [currentTime])

  const startTimer = () => {
    setTimerInterval(
      setInterval(() => {
        setCurrentTime((time) => time + 1)
      }, 1000)
    )
  }

  const stopTimer = () => {
    clearInterval(timerInterval)
  }

  const resetTimer = () => {
    // stopTimer()
    setCurrentTime(0)
  }

  const updateTimer = (val) => {
    setCurrentTime(val)
  }

  return ReactDOM.createPortal(
    <div className="timer-container">
      <input
        type="range"
        className="timer-container__slider"
        min={0}
        max={duration}
        value={currentTime}
        step={1}
        onChange={(e) => {
          updateTimer(parseInt(e.target.value, 10))
          if (service === "spotify") {
            //
          }
          if (service === "soundcloud") {
            //
          }
        }}
        onMouseUp={(e) => {
          const ms = parseInt(e.target.value, 10) * 1000
          if (service === "spotify" && window.spotifyPlayer) {
            window.spotifyPlayer
              .seek(ms)
              .then(() => updateTimer(e.target.value))
              .catch((err) => console.log(111))
          }
        }}
      />
      <span className="timer-container__current-time">
        {formatAudioTime(currentTime)}
      </span>
      <span className="timer-container__duration">
        {formatAudioTime(duration || 0)}
      </span>
    </div>,
    portalRef.current
  )
}
