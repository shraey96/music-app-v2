import React, { useState, useEffect, Suspense } from "react"
import { useSelector } from "react-redux"

import "./base.scss"

const Login = React.lazy(() =>
  import(/* webpackChunkName: 'Login' */ "pages/Login")
)

const Home = React.lazy(() =>
  import(/* webpackChunkName: 'Home' */ "pages/Home")
)

const App = () => {
  const [loader, toggleLoader] = useState(false)

  const userStore = useSelector((state) => state.user)
  // const isUserAuthAndServices =
  //   userStore.userAuth && userStore.userInfo.services.length > 0
  const isUserAuthAndServices = userStore.userAuth
  console.log(111, isUserAuthAndServices)
  return (
    <div className="music-app-container">
      <Suspense fallback={<></>}>
        {!isUserAuthAndServices ? <Login /> : <Home />}
      </Suspense>
    </div>
  )
}

export default App
