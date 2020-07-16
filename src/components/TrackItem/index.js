import React from "react"
import { motion } from "framer-motion"
import { EllipsisScroll } from "components"

import "./style.scss"

export const TrackItem = ({ trackInfo, playTrack, index }) => {
  const trackType =
    trackInfo.uri && trackInfo.uri.includes("soundcloud")
      ? "soundcloud"
      : "spotify"
  const artists =
    trackType === "soundcloud"
      ? trackInfo.user.username
      : trackInfo.artists.map((a) => a.name).join(", ")

  return (
    <motion.div
      initial={{ originX: 0, originY: 0, scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.05 * (index % 50), type: "spring", stiffness: 50 }}
      className={`track-item track-item--${trackInfo.trackType}`}
      onClick={() => playTrack && playTrack(trackInfo.uri)}
    >
      <div className="img-container">
        <img
          src={
            trackType === "soundcloud"
              ? (trackInfo.artwork_url || trackInfo.user.avatar_url).replace(
                  "large.jpg",
                  "t500x500.jpg"
                )
              : trackInfo.album.images[0].url
          }
          alt=""
          className="track-item__cover"
        />
      </div>

      <EllipsisScroll
        classNames="track-item__title"
        text={trackInfo.name || trackInfo.title}
      />
    </motion.div>
  )
}
