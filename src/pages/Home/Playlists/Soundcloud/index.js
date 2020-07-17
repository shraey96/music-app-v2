import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useInfiniteScroll } from "Hooks/useInfiniteScroll"
import { PlaylistItem } from "components"

import { playTrack } from "redux-app/actions"

import "./style.scss"

export const SoundcloudPlaylists = () => {
  const dispatch = useDispatch()
  const [selectedCard, toggleSelectedCard] = useState(-1)
  const soundcloudPlaylist =
    useSelector((state) => state.user.soundcloudPlaylist) || []
  const playerState = useSelector((state) => state.player)
  const { reqData = [] } = useInfiniteScroll({
    data: soundcloudPlaylist,
  })

  const handlePlayTrack = (index, track, queue, pId = false) => {
    dispatch(
      playTrack({
        isAudioPlaying: false,
        trackPayload: {
          service: "soundcloud",
          trackId: track.id,
          trackInfo: track,
        },
        trackIndex: index,
        playQueue: queue,
        playlistId: pId,
      })
    )
  }

  const handleKeyDown = (e) => {
    if (selectedCard > -1) {
      e.keyCode === 27 && toggleSelectedCard(-1)
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [selectedCard])

  return (
    <>
      {selectedCard > -1 && (
        <div
          className="playlist-item-overlay"
          onClick={() => toggleSelectedCard(-1)}
        />
      )}
      {reqData.map((p, i) => {
        return (
          <PlaylistItem
            key={p.id}
            playlistInfo={p}
            index={i}
            selectedCard={selectedCard}
            setSelectedCard={() =>
              toggleSelectedCard(selectedCard === i ? -1 : i)
            }
            playTrack={(i, t, q, pId) => handlePlayTrack(i, t, q, pId)}
            playerState={playerState}
          />
        )
      })}
    </>
  )
}
