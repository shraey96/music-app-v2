import React from "react"
import { useSelector } from "react-redux"
import { useInfiniteScroll } from "Hooks/useInfiniteScroll"
import { TrackItem } from "components"

import { playSpotifyTrackComponent } from "utils/spotifyHelpers"

export const Spotify = () => {
  const spotifyLikes = useSelector((state) => state.user.spotifyLikes)
  const spotifyLikesArray = Object.values(spotifyLikes || {})
  const { reqData = [] } = useInfiniteScroll({
    data: spotifyLikesArray,
  })

  const playTrack = (index, track) => {
    playSpotifyTrackComponent({
      trackIndex: index,
      playQueue: spotifyLikesArray,
      trackId: track.id,
      uri: track.uri,
      trackInfo: track,
    })
  }

  return (
    <>
      {reqData.map((t, i) => {
        return (
          <TrackItem
            key={t.id}
            trackInfo={t}
            playTrack={() => playTrack(i, t)}
          />
        )
      })}
    </>
  )
}
