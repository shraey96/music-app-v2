import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import * as Vibrant from "node-vibrant"
import { EllipsisScroll } from "components"

import { getSpotifyPlaylistTracks } from "utils/spotifyHelpers"
import { getSCPlaylistTracks } from "utils/soundcloudHelpers"

import { ICONS } from "iconConstants"

import "./style.scss"

const openSpring = { type: "spring", stiffness: 200, damping: 30 }
const closeSpring = { type: "spring", stiffness: 300, damping: 35 }

export const PlaylistItem = ({
  playlistInfo,
  index,
  selectedCard,
  setSelectedCard,
  playTrack,
  playerState,
}) => {
  const isSelected = index === selectedCard
  const [pallete, setPallete] = useState(null)
  const [loading, toggleLoading] = useState(false)
  const [hasFetched, toggleHasFetched] = useState(false)
  const [playlistTracks, setPlaylistTracks] = useState([])

  const fetchPlaylistTracks = async () => {
    toggleLoading(true)

    const tracks = await (playlistInfo.title
      ? getSCPlaylistTracks(playlistInfo.id)
      : getSpotifyPlaylistTracks(playlistInfo.tracks.href, playlistInfo.id))

    if (tracks) {
      setPlaylistTracks(tracks)
    }

    toggleHasFetched(true)
    toggleLoading(false)
  }

  const handlePlaylistPlay = (index = 0) => {
    playTrack(index, playlistTracks[index], playlistTracks, playlistInfo.id)
  }

  useEffect(() => {
    const imgURL = playlistInfo.images
      ? playlistInfo.images[0].url
      : (playlistInfo.artwork_url || playlistInfo.user.avatar_url).replace(
          "large.jpg",
          "t500x500.jpg"
        )
    Vibrant.from(`https://cryptic-ravine-67258.herokuapp.com/` + imgURL)
      .getPalette()
      .then((pallete) => setPallete(pallete))
      .catch(() => setPallete(null))
  }, [])

  useEffect(() => {
    if (isSelected && playlistTracks.length === 0 && !hasFetched) {
      fetchPlaylistTracks()
    }
  }, [isSelected, playlistTracks, hasFetched])

  const bgPallete =
    pallete || pallete !== null
      ? `linear-gradient(90deg, rgba(${pallete.DarkMuted.rgb.join()},0.4) 0%, rgba(${
          pallete.DarkVibrant.rgb
        },0.7) 100%)`
      : "transparent"

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
                    src={
                      playlistInfo.images
                        ? playlistInfo.images[0].url
                        : (
                            playlistInfo.artwork_url ||
                            playlistInfo.user.avatar_url
                          ).replace("large.jpg", "t500x500.jpg")
                    }
                    alt=""
                    className={`playlist-item__cover`}
                  />
                  {isSelected && playlistTracks.length > 0 && (
                    <span
                      className="playback-control"
                      onClick={() => handlePlaylistPlay()}
                    >
                      {playerState.isAudioPlaying &&
                      playerState.playlistId === playlistInfo.id
                        ? ICONS.PAUSE
                        : ICONS.PLAY_FILLED}
                    </span>
                  )}
                </div>
                {!isSelected && (
                  <EllipsisScroll
                    classNames="playlist-item__title"
                    text={playlistInfo.name || playlistInfo.title}
                  />
                )}
                {isSelected && (
                  <>
                    <div className="playlist-full-header">
                      <p className="playlist-title">
                        {" "}
                        {playlistInfo.name || playlistInfo.title}
                      </p>
                      <p
                        className="playlist-info"
                        dangerouslySetInnerHTML={{
                          __html:
                            playlistInfo.description ||
                            playlistInfo.description,
                        }}
                      />
                    </div>
                  </>
                )}
              </div>
              {isSelected && (
                <div className="playlist-tracks">
                  {loading && <div className="nb-spinner" />}
                  {playlistTracks.length > 0 &&
                    playlistTracks.map((p, k) => {
                      const artists = p.title
                        ? p.user.username
                        : p.artists.map((a) => a.name).join(", ")

                      return (
                        <div
                          key={p.id}
                          className="playlist-tracks__item"
                          onClick={() => handlePlaylistPlay(k)}
                        >
                          <span className="playback-control">
                            {playerState.isAudioPlaying &&
                            playerState.currentTrack.trackId === p.id
                              ? ICONS.PAUSE
                              : ICONS.PLAY_FILLED}
                          </span>
                          <div className="track-title">{p.name || p.title}</div>
                          <div className="track-artist">{artists}</div>
                        </div>
                      )
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
