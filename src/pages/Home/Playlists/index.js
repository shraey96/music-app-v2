import React from "react"
import { Switch, Route } from "react-router-dom"
import { TabItems } from "components"
import { SpotifyPlaylists } from "./Spotify"
import { SoundcloudPlaylists } from "./Soundcloud"

const tabItems = [
  {
    label: "Spotify",
    value: "/home/playlists/spotify",
  },
  {
    label: "Soundcloud",
    value: "/home/playlists/soundcloud",
  },
  {
    label: "Combine",
    value: "/home/playlists/app",
  },
]

export const Playlists = () => {
  return (
    <>
      <TabItems tabs={tabItems} />
      <div className="music-app-home__container__playlists">
        <Switch>
          <Route exact path="/home/playlists/spotify">
            <SpotifyPlaylists />
          </Route>
          <Route exact path="/home/playlists/soundcloud">
            <SoundcloudPlaylists />
          </Route>
        </Switch>
      </div>
    </>
  )
}
