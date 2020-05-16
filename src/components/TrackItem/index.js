import React from "react"

import "./style.scss"

export const TrackItem = ({ trackInfo, playTrack }) => {
  return (
    <div
      className={`track-item track-item--${trackInfo.trackType}`}
      onClick={() => playTrack && playTrack(trackInfo.uri)}
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
