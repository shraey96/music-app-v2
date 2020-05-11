import React, { useState, useEffect, Suspense } from "react"
import { useSelector } from "react-redux"
import { withRouter, Route } from "react-router-dom"

import "./base.scss"

const Login = React.lazy(() => import("pages/Login"))

const Home = React.lazy(() => import("pages/Home"))

const App = (props) => {
  const [loader, toggleLoader] = useState(false)

  const userStore = useSelector((state) => state.user)
  // const isUserAuthAndServices =
  //   userStore.userAuth && userStore.userInfo.services.length > 0
  const isUserAuthAndServices = userStore.userAuth

  if (isUserAuthAndServices && !props.location.pathname.includes("/home")) {
    props.history.push("/home")
  }
  return (
    <div className="music-app-container">
      <Suspense fallback={<></>}>
        {!isUserAuthAndServices ? (
          <Login />
        ) : (
          <Route exact path="/home/:service?/:section?">
            <Home />
          </Route>
        )}
      </Suspense>
    </div>
  )
}

export default withRouter(App)
