import React, { useState } from "react"
import { useDispatch } from "react-redux"

import { setUserLogin } from "redux-app/actions"
import { setAppAccessToken } from "utils/userHelpers"

import "./style.scss"

const Login = () => {
  const dispatch = useDispatch()
  const [payload, setPayload] = useState({})
  const [isRegistrationMode, toggleRegistrationMode] = useState(false)

  const handleLogin = () => {
    const access_token = "DDH1R4GH3"
    const refresh_token = "1212312313"
    // make call with creds
    // ===> await login <=== //
    // get token and set in redux, create axios instance
    setAppAccessToken({ access_token, refresh_token })
    dispatch(
      setUserLogin({
        userInfo: { email: payload.email, services: ["spotify", "soundcloud"] },
      })
    )
  }

  return (
    <div className="login-container">
      <input
        placeholder="email"
        type="text"
        value={payload.email}
        autoComplete={false}
        onChange={(e) => setPayload({ ...payload, email: e.target.value })}
      />
      <input
        placeholder="password"
        type="password"
        value={payload.password}
        autoComplete={false}
        onChange={(e) => setPayload({ ...payload, password: e.target.value })}
      />
      {isRegistrationMode && (
        <input
          placeholder="confirm password"
          type="password"
          value={payload.confirmPassword}
          autoComplete={false}
          onChange={(e) =>
            setPayload({ ...payload, confirmPassword: e.target.value })
          }
        />
      )}
      <button onClick={() => toggleRegistrationMode(true)}>Register</button>
      <button onClick={() => handleLogin()}>Login </button>
    </div>
  )
}

export default Login
