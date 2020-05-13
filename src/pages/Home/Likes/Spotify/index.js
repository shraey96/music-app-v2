import React from "react"
import { useSelector } from "react-redux"
import { useInfiniteScroll } from "Hooks/useInfiniteScroll"
import { TrackItem } from "components"

export const Spotify = () => {
  const spotifyLikes = useSelector((state) => state.user.spotifyLikes)
  const { reqData = [] } = useInfiniteScroll({
    data: Object.values(spotifyLikes || {}),
  })

  return (
    <>
      {reqData.map((t) => {
        return <TrackItem key={t.id} trackInfo={t} />
      })}
    </>
  )
}
