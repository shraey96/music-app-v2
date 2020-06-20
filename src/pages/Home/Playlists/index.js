import React from "react"
import { Switch, Route } from "react-router-dom"
import { TabItems } from "components"
import { SpotifyPlaylists } from "./Spotify"

const tabItems = [
  {
    label: "Spotify",
    value: "/home/playlists/spotify",
  },
  {
    label: "App",
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
        </Switch>
      </div>
    </>
  )
}
