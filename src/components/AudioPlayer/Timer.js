import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react"

import Slider from "react-smooth-range-input"

import { formatAudioTime } from "utils/helpers"

export const Timer = forwardRef((props, ref) => {
  const { duration, trackId, isAudioPlaying, service, spotifyPlayer } = props
  const [currentTime, setCurrentTime] = useState(0)
  let timerInterval = null

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

  useImperativeHandle(ref, () => {
    return {
      updateTimer: updateTimer,
    }
  })

  const startTimer = () => {
    timerInterval = setInterval(() => {
      setCurrentTime((time) => time + 1)
    }, 1000)
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

  console.log(99999, currentTime)

  return (
    <div className="timer-container">
      <span>{formatAudioTime(currentTime)}</span>
      <input
        type="range"
        min={0}
        max={duration}
        value={currentTime}
        step={1}
        //   onChange={(e) => (this._audio.currentTime = e.target.value)}
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
      <span>{formatAudioTime(duration || 0)}</span>
    </div>
  )
})
