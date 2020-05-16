import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react"

import ReactDOM from "react-dom"

import { formatAudioTime } from "utils/helpers"

export const Timer = forwardRef((props, ref) => {
  const {
    duration,
    trackId,
    isAudioPlaying,
    service,
    spotifyPlayer,
    portalRef,
    onTrackEnd,
  } = props
  const [currentTime, setCurrentTime] = useState(0)
  const [timerInterval, setTimerInterval] = useState(null)
  //   let timerInterval = null

  useEffect(() => {
    if (spotifyPlayer) {
      // bindSpotifySeeker()
    }
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

  useImperativeHandle(ref, () => {
    return {
      updateTimer: updateTimer,
    }
  })

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
})
