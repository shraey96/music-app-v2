import React from "react"

import { EllipsisScroll } from "components"

import "./style.scss"

export const TrackItem = ({ trackInfo, playTrack }) => {
  const artists = trackInfo.artists.map((a) => a.name).join(", ")
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
      {/* <div className="track-item__title text-ellipsis">{trackInfo.name}</div> */}
      <div className="text-ellipsis">
        <EllipsisScroll classNames="track-item__title" text={trackInfo.name} />
      </div>
    </div>
  )
}
