import React from "react"
import { BroadcastChannel } from "broadcast-channel"

import "./style.scss"

const spotifyChannel = new BroadcastChannel("SPOTIFY_PLAY_TRACK")

export const TrackItem = ({ trackInfo }) => {
  return (
    <div
      className={`track-item track-item--${trackInfo.trackType}`}
      onClick={() => spotifyChannel.postMessage({ uri: trackInfo.uri })}
    >
      <img
        src={trackInfo.album.images[0].url}
        alt=""
        className="track-item__cover"
      />
      <div className="track-item__title text-ellipsis">{trackInfo.name}</div>
    </div>
  )
}
