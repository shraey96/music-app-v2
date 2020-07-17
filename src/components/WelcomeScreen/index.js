import React from "react"
import { useSelector } from "react-redux"

import { Button } from "components"

import { loginSoundcloud } from "utils/soundcloudHelpers"
import { loginSpotify } from "utils/spotifyHelpers"

import { ICONS } from "iconConstants"

import "./style.scss"

const SUPPORTED_SERVICES = ["spotify", "soundcloud"]

export const WelcomeScreen = ({ proceed }) => {
  const userInfo = useSelector((state) => state.user.userInfo)
  const userServices = userInfo.services

  const handleSerivceLogin = (service) => {
    console.log(service)
    if (service === "soundcloud") {
      loginSoundcloud()
    }
    if (service === "spotify") {
      loginSpotify()
    }
  }

  console.log(userServices)
  return (
    <div className="welcome-screen">
      <div className="welcome-screen__container">
        <div className="container-left"></div>
        <div className="container-right">
          <div className="info">
            <h1>Combine - Music</h1>
            <p>
              All your favourite music, from all the great apps, all in one
              place!
            </p>
          </div>
          <div className="services">
            <p>Select services to connect: </p>
            <div className="service-item-container">
              {SUPPORTED_SERVICES.map((s) => {
                return (
                  <div className="service-item">
                    <span>
                      <img
                        src={require(`images/service-icons/${s}-logo.png`)}
                      />
                    </span>
                    {!userServices.includes(s) && (
                      <p
                        className="service-item__connector"
                        onClick={() => handleSerivceLogin(s)}
                      >
                        Connect
                      </p>
                    )}
                    {userServices.includes(s) && (
                      <span className="service-done-icon">{ICONS.DONE}</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
          <div className="success-btn">
            {userServices.length > 0 && (
              <Button label="Let's Go!" onClick={() => proceed && proceed()} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
