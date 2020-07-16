import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { useHistory, useParams } from "react-router-dom"
import { motion } from "framer-motion"

import { SIDEBAR_ITEMS } from "utils/constants"

import { SPOTIFY_LOGIN_LINK } from "utils/spotifyHelpers"
import { loginSoundcloud } from "utils/soundcloudHelpers"

import { ICONS } from "iconConstants"

import "./style.scss"

export const Sidebar = () => {
  const [isMinimized, toggleMinimized] = useState(false)
  const [selectedTab, toggleSelectedTab] = useState("music")
  const history = useHistory()
  const { section } = useParams()

  const handleSoundCloudAuth = () => {
    loginSoundcloud().then(() => {
      // window.SC.get("/me")
      // window.SC.get("/me/favorites?limit=200&linked_partitioning=1")
      // window.SC.stream(`/tracks/243895680`)
      // window.SC.stream("/tracks/53875317").then(function (player) {
      //   console.log(234, player)
      //   player
      //     .play()
      //     .then(function () {
      //       console.log("Playback started!")
      //     })
      //     .catch(function (e) {
      //       console.error(
      //         "Playback rejected. Try calling play() from a user interaction.",
      //         e
      //       )
      //     })
      // })
    })
    // window.SC.connect().then((scAuth) => {
    //   setSoundCloudTokenHeader(scAuth.oauth_token)
    //   // window.SC.get("/me")
    //   // window.SC.get("/me/favorites?limit=200&linked_partitioning=1")
    //   // window.SC.stream(`/tracks/243895680`)
    //   // window.SC.stream("/tracks/53875317").then(function (player) {
    //   //   console.log(234, player)
    //   //   player
    //   //     .play()
    //   //     .then(function () {
    //   //       console.log("Playback started!")
    //   //     })
    //   //     .catch(function (e) {
    //   //       console.error(
    //   //         "Playback rejected. Try calling play() from a user interaction.",
    //   //         e
    //   //       )
    //   //     })
    //   // })
    // })
  }

  useEffect(() => {
    const appHomeDOM = document.querySelector(".music-app-home")
    if (appHomeDOM) {
      isMinimized
        ? appHomeDOM.classList.add("music-app-home--full")
        : appHomeDOM.classList.remove("music-app-home--full")
    }
  }, [isMinimized])

  const userInfo = useSelector((state) => state.user.userInfo)
  const userServices = userInfo.services

  return (
    <div className={`sidebar ${isMinimized && "sidebar--minimized"}`}>
      {/* <audio
        preload="metadata"
        src={
          "https://cf-hls-media.sndcdn.com/media/1436524/1596184/HqmoUU9NX7Fk.128.mp3?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiKjovL2NmLWhscy1tZWRpYS5zbmRjZG4uY29tL21lZGlhLyovKi9IcW1vVVU5Tlg3RmsuMTI4Lm1wMyIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTU5MzM0NTI4OX19fV19&Signature=GEW~o38xci~p6HM2fcmzCAe71e2jSrd5MY3aHBm4wgGkyv8d2oKbwI9L9JC06FMqOsKMgq6UJu0CaYbsc9~FuFJ3EmO~FDsR5O2jDYHxXsZ1~4mFCb7Fc4KQFWHJlvoD1o6zMUrdvdAA80dFPJ09fbq1Iwg5F6XvQTuYDAXblZGBbtEMj5A5lwZ-DtdrXt0Cc56mraRcqoQ4HwORrhrOouWKrLJlOtuhfx27~yjbie0Sp6swmm2Fc4JxgmOnwqgL5byvztWFOBKm3jai2mw4iqdfqCQb0Pd2lwYB0mbY-v3dXNTLQ8dbtkNbyhPlIsrvrZ1WvgYc34PUgDRSxJiWhA__&Key-Pair-Id=APKAI6TU7MMXM5DG6EPQ"
        }
        controls
        type="audio/mpeg"
      /> */}
      <div className="sidebar__items-container">
        <span
          className={`minimize-toggle ${
            isMinimized && "minimize-toggle--minimized"
          }`}
          onClick={() => toggleMinimized((p) => !p)}
        >
          {ICONS.BACK}
        </span>
        <motion.div
          initial={{
            background: `linear-gradient(135deg, rgba(0, 162, 255, 0.4) 0%, rgba(17, 16, 23, 0.4) 100%)`,
          }}
          animate={{
            background:
              selectedTab === "music"
                ? `linear-gradient(135deg, rgba(0, 162, 255, 0.4) 0%, rgba(17, 16, 23, 0.4) 100%)
        `
                : selectedTab === "spotify"
                ? `linear-gradient(133.64deg, rgba(31, 234, 112, 0.4) 0%, rgba(17, 16, 23, 0.4) 100%)`
                : `linear-gradient(135deg, rgba(255, 98, 9, 0.4) 0%, rgba(17, 16, 23, 0.4) 100%)`,
          }}
          className="gradient-box"
        />
        {Object.keys(SIDEBAR_ITEMS).map((k, l) => {
          const reqItem = SIDEBAR_ITEMS[k]
          const isSelected = reqItem.value === selectedTab
          const parentDelay = l * 0.6

          return (
            <motion.div
              key={k}
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
              }}
              transition={{
                delay: parentDelay,
              }}
              className="sidebar__section"
            >
              {
                <span
                  className={`sidebar__section__label ${
                    isSelected && "sidebar__section__label--active"
                  }`}
                  onClick={() => toggleSelectedTab(reqItem.value)}
                >
                  <img
                    src={require(`images/service-icons/${reqItem.value}-logo.png`)}
                  />
                </span>
              }
              {isSelected && (
                <div
                  className={`sidebar__section__items-container ${
                    isMinimized &&
                    "sidebar__section__items-container--minimized"
                  }`}
                >
                  {reqItem.items.map((i, k) => {
                    return (
                      <motion.div
                        key={i.value}
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: 1,
                        }}
                        transition={{
                          delay: k * 0.1,
                        }}
                        className={`sidebar__section__item ${
                          section === i.value &&
                          "sidebar__section__item--active"
                        }`}
                        onClick={() =>
                          !reqItem.isServiceConnector &&
                          history.push(`/home/${i.value}/${userServices[0]}`)
                        }
                      >
                        {i.label}
                        {i.value === "connect" &&
                          reqItem.isServiceConnector && (
                            <>
                              {!userServices.includes(i.value) && (
                                <p>connect</p>
                              )}
                            </>
                          )}
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
      <a href={SPOTIFY_LOGIN_LINK}>Login Spotify</a>
      <button onClick={() => handleSoundCloudAuth()}>Login SoundCloud</button>
    </div>
  )
}
