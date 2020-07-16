import React, { useState } from "react"
import { Switch, Route } from "react-router-dom"
import { TabItems, InputBox } from "components"
import { SpotifyLikes } from "./Spotify"
import { SoundcloudLikes } from "./Soundcloud"

const tabItems = [
  {
    label: "Spotify",
    value: "/home/likes/spotify",
  },
  {
    label: "Soundcloud",
    value: "/home/likes/soundcloud",
  },
  {
    label: "App",
    value: "/home/likes/app",
  },
]

export const Likes = () => {
  const [searchVal, setSearchVal] = useState("")
  return (
    <>
      <TabItems tabs={tabItems} />
      <InputBox
        portalRef={document.querySelector(".search-box-container")}
        value={searchVal}
        onChange={(e) => setSearchVal(e.target.value)}
      />
      <div className="music-app-home__container__likes">
        <Switch>
          <Route exact path="/home/likes/spotify">
            <SpotifyLikes searchVal={searchVal} />
          </Route>
          <Route exact path="/home/likes/soundcloud">
            <SoundcloudLikes searchVal={searchVal} />
          </Route>
        </Switch>
      </div>
    </>
  )
}
