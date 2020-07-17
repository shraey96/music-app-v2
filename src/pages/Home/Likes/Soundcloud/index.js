import React from "react"
import { useSelector, useDispatch } from "react-redux"
import { useInfiniteScroll } from "Hooks/useInfiniteScroll"
import { TrackItem } from "components"

import { playTrack } from "redux-app/actions"

export const SoundcloudLikes = ({ searchVal }) => {
  const dispatch = useDispatch()

  const soundcloudLikes = useSelector((state) => state.user.soundcloudLikes)
  const playerState = useSelector((state) => state.player)
  const soundcloudLikesArray = Object.values(
    soundcloudLikes || {}
  ).filter((t) => t.title.toLowerCase().includes(searchVal.toLowerCase()))
  // .sort((a, b) => {
  //   a = new Date(a.liked_at)
  //   b = new Date(b.liked_at)
  //   return a > b ? -1 : a < b ? 1 : 0
  // })

  const { reqData = [] } = useInfiniteScroll({
    data: soundcloudLikesArray,
    searchTerm: searchVal,
  })

  console.log(111, reqData)

  const handlePlayTrack = (index, track) => {
    dispatch(
      playTrack({
        isAudioPlaying: false,
        trackPayload: {
          service: "soundcloud",
          trackId: track.id,
          trackInfo: track,
        },
        trackIndex: index,
        playQueue: soundcloudLikesArray,
      })
    )
  }

  return (
    <>
      {reqData.map((t, i) => {
        return (
          <TrackItem
            key={t.id}
            index={i}
            trackInfo={t}
            playTrack={() => handlePlayTrack(i, t)}
            playerState={playerState}
          />
        )
      })}
    </>
  )
}
