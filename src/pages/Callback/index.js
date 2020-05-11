import React, { useEffect } from "react"
import { withRouter } from "react-router-dom"

import { getQueryParams } from "utils/helpers"

import { getSpotifyToken } from "utils/spotifyHelpers"

const Callback = ({ match, history }) => {
  useEffect(() => {
    const { params } = match

    if (params.service === "spotify") {
      const spotifyCode = getQueryParams(window.location.href, "code")
      if (spotifyCode) {
        getSpotifyToken(spotifyCode).then(() => history.push("/home"))
      }
    }
  }, [])
  return <></>
}

export default withRouter(Callback)
