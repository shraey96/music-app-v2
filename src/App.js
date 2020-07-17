import React, { useState, useEffect, Suspense } from "react"
import { useSelector } from "react-redux"
import { useHistory, useParams, Route } from "react-router-dom"

import {
  SOUNDCLOUD_CLIENT_ID,
  SOUNDCLOUD_REDIRECT_URL,
} from "utils/soundcloudHelpers"

import { WelcomeScreen } from "components"

import "./base.scss"

const Home = React.lazy(() => import("pages/Home"))

const Callback = React.lazy(() => import("pages/Callback"))

// import Home from "pages/Home"
// import Callback from 'pages/Callback'

const App = (props) => {
  const history = useHistory()

  const [showWelcomeScreen, toggleShowWelcomeScreen] = useState(false)
  const userStore = useSelector((state) => state.user)
  const isUserAuthAndServices = userStore.userInfo.services.length > 0

  useEffect(() => {
    window.SC.initialize({
      client_id: SOUNDCLOUD_CLIENT_ID,
      redirect_uri: SOUNDCLOUD_REDIRECT_URL,
    })

    if (isUserAuthAndServices && !window.location.href.includes("/callback/")) {
      history.push("/home")
    }

    if (!isUserAuthAndServices) {
      toggleShowWelcomeScreen(true)
    }
  }, [])

  // const isUserAuthAndServices = userStore.userAuth

  return (
    <div className="music-app-container">
      <Suspense fallback={<div className="base-loader" />}>
        {showWelcomeScreen ? (
          <WelcomeScreen
            proceed={() => {
              // history.push(`/home/likes/${userStore.userInfo.services[0]}`)
              // setTimeout(() => {
              //   toggleShowWelcomeScreen(false)
              // }, 300)
              window.location.reload()
            }}
          />
        ) : (
          <Route exact path="/home/:section?/:service?">
            <Home userStore={userStore} />
          </Route>
        )}
        <Route exact path="/callback/:service?">
          <Callback />
        </Route>
      </Suspense>
    </div>
  )
}

export default App
