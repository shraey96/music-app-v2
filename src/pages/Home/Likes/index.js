import React from "react"
import { Switch, Route } from "react-router-dom"
import { TabItems } from "components"
import { Spotify } from "./Spotify"

const tabItems = [
  {
    label: "Spotify",
    value: "/home/likes/spotify",
  },
  {
    label: "App",
    value: "/home/likes/app",
  },
]

export const Likes = () => {
  return (
    <>
      <TabItems tabs={tabItems} />
      <div className="music-app-home__container__likes">
        <Switch>
          <Route exact path="/home/likes/spotify">
            <Spotify />
          </Route>
        </Switch>
      </div>
    </>
  )
}
