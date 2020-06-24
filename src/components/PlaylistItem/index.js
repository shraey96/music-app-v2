import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import * as Vibrant from "node-vibrant"
import { EllipsisScroll } from "components"

import { getSpotifyPlaylistTracks } from "utils/spotifyHelpers"

import "./style.scss"

const openSpring = { type: "spring", stiffness: 200, damping: 30 }
const closeSpring = { type: "spring", stiffness: 300, damping: 35 }

export const PlaylistItem = ({
  playlistInfo,
  index,
  selectedCard,
  setSelectedCard,
  playTrack,
}) => {
  const isSelected = index === selectedCard
  const [pallete, setPallete] = useState(null)
  const [loading, toggleLoading] = useState(false)
  const [playlistTracks, setPlaylistTracks] = useState([])

  const fetchPlaylistTracks = async () => {
    toggleLoading(true)
    const tracks = await getSpotifyPlaylistTracks(
      playlistInfo.tracks.href,
      playlistInfo.id
    )
    if (tracks) {
      setPlaylistTracks(tracks)
    }
    toggleLoading(false)
  }

  const handlePlaylistPlay = (index = 0) => {
    console.log("handle playlist play")
    playTrack(index, playlistTracks[index], playlistTracks)
  }

  useEffect(() => {
    Vibrant.from(
      `https://cryptic-ravine-67258.herokuapp.com/` + playlistInfo.images[0].url
    )
      .getPalette()
      .then((pallete) => setPallete(pallete))
      .catch((err) => setPallete(null))
  }, [])

  useEffect(() => {
    if (isSelected && playlistTracks.length === 0) {
      fetchPlaylistTracks()
    }
  }, [isSelected, playlistTracks])

  const bgPallete =
    pallete || pallete !== null
      ? `linear-gradient(90deg, rgba(${pallete.DarkMuted.rgb.join()},0.4) 0%, rgba(${
          pallete.DarkVibrant.rgb
        },0.7) 100%)`
      : "transparent"

  // console.log(222, playlistTracks, playlistInfo)
  return (
    <>
      <motion.div
        initial={{ originX: 0, originY: 0, scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          delay: 0.05 * (index % 50),
          type: "spring",
          stiffness: 50,
        }}
        className={`playlist-item playlist-item--spotify `}
        onClick={() => !isSelected && setSelectedCard()}
      >
        <div
          className={`playlist-item__content-container ${
            isSelected && "playlist-item__content-container--open"
          } ${!isSelected && "playlist-item__content-container--with-hover"}`}
        >
          <motion.div
            className="card-content"
            layoutTransition={isSelected ? openSpring : closeSpring}
          >
            <div
              className={`card-content__header ${
                isSelected && "card-content__header--open"
              }`}
              style={{
                background: isSelected ? bgPallete : "transparent",
              }}
            >
              <div className="card-header">
                <div className="image-container">
                  <img
                    src={playlistInfo.images[0].url}
                    alt=""
                    className={`playlist-item__cover`}
                  />
                  {isSelected && playlistTracks.length > 0 && (
                    <button
                      className="playback-control"
                      onClick={() => handlePlaylistPlay()}
                    >
                      Play
                    </button>
                  )}
                </div>
                {!isSelected && (
                  <EllipsisScroll
                    classNames="playlist-item__title"
                    text={playlistInfo.name}
                  />
                )}
                {isSelected && (
                  <>
                    <div className="playlist-full-header">
                      <p className="playlist-title"> {playlistInfo.name}</p>
                      <p
                        className="playlist-info"
                        dangerouslySetInnerHTML={{
                          __html: playlistInfo.description,
                        }}
                      />
                    </div>
                  </>
                )}
              </div>
              {isSelected && (
                <div className="playlist-tracks">
                  {loading && <p>Loading...</p>}
                  {playlistTracks.length > 0 &&
                    playlistTracks.map((p) => {
                      return <div>{p.name}</div>
                    })}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  )
}
