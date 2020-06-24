import React from "react"
import { useSelector } from "react-redux"
import { useInfiniteScroll } from "Hooks/useInfiniteScroll"
import { TrackItem, InputBox } from "components"

import { playSpotifyTrackComponent } from "utils/spotifyHelpers"

export const SpotifyLikes = ({ searchVal }) => {
  const spotifyLikes = useSelector((state) => state.user.spotifyLikes)
  const spotifyLikesArray = Object.values(spotifyLikes || {}).filter((t) =>
    t.name.toLowerCase().includes(searchVal.toLowerCase())
  )
  console.log(222, spotifyLikesArray)
  const { reqData = [] } = useInfiniteScroll({
    data: spotifyLikesArray,
    searchTerm: searchVal,
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

  // console.log(111, reqData)

  return (
    <>
      {reqData.map((t, i) => {
        return (
          <TrackItem
            key={t.id}
            index={i}
            trackInfo={t}
            playTrack={() => playTrack(i, t)}
          />
        )
      })}
    </>
  )
}
