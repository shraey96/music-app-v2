import React from "react"
import { useSelector } from "react-redux"
import { TrackItem } from "components"

export const Spotify = () => {
  const spotifyLikes = useSelector((state) => state.user.spotifyLikes)

  return (
    <>
      {Object.values(spotifyLikes || {}).map((t) => {
        return <TrackItem trackInfo={t} />
      })}
    </>
  )
}
