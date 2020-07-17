import React, { useEffect } from "react"
import { withRouter } from "react-router-dom"

import { getQueryParams } from "utils/helpers"

import { getSpotifyToken } from "utils/spotifyHelpers"

const Callback = ({ match }) => {
  useEffect(() => {
    const { params } = match

    if (params.service === "spotify") {
      const spotifyCode = getQueryParams(window.location.href, "code")
      if (spotifyCode) {
        getSpotifyToken(spotifyCode).then(() => {
          window.opener.updateSpotifyLogin()
          window.close()
        })
      }
    }
    if (params.service === "soundcloud") {
      window.setTimeout(window.opener.SC.connectCallback, 2)
    }
  })
  return <></>
}

export default withRouter(Callback)
