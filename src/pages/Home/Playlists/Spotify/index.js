import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { useInfiniteScroll } from "Hooks/useInfiniteScroll"
import { PlaylistItem } from "components"

import { playSpotifyTrackComponent } from "utils/spotifyHelpers"

import "./style.scss"

export const SpotifyPlaylists = () => {
  const [selectedCard, toggleSelectedCard] = useState(-1)
  const spotifyPlaylists =
    useSelector((state) => state.user.spotifyPlaylists) || []
  const playerState = useSelector((state) => state.player)
  const { reqData = [] } = useInfiniteScroll({
    data: spotifyPlaylists,
  })

  const playTrack = (index, track, queue, pId = false) => {
    playSpotifyTrackComponent({
      trackIndex: index,
      playQueue: queue,
      trackId: track.id,
      uri: track.uri,
      trackInfo: track,
      playlistId: pId,
    })
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
            playTrack={(i, t, q, pId) => playTrack(i, t, q, pId)}
            playerState={playerState}
          />
        )
      })}
    </>
  )
}
