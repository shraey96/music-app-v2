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
        // send via broadcast to parent
        getSpotifyToken(spotifyCode).then(() => history.push("/home"))
      }
    }
    if (!params.service || params.service === "soundcloud") {
      window.setTimeout(window.opener.SC.connectCallback, 2)
    }
  }, [])
  return <></>
}

export default withRouter(Callback)
