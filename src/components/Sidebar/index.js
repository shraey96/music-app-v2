import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { useHistory, useParams } from "react-router-dom"
import { motion } from "framer-motion"

import { SIDEBAR_ITEMS } from "utils/constants"

import { loginSpotify } from "utils/spotifyHelpers"
import { loginSoundcloud } from "utils/soundcloudHelpers"

import { ICONS } from "iconConstants"

import "./style.scss"

const serviceTitleMaps = {
  music: "Combine-Music",
  spotify: "Spotify",
  soundcloud: "Soundcloud",
}

export const Sidebar = () => {
  const [isMinimized, toggleMinimized] = useState(false)
  const [selectedTab, toggleSelectedTab] = useState("music")
  const history = useHistory()
  const { section } = useParams()

  const handleSoundCloudLogin = () => {
    loginSoundcloud().then(() => {
      // get sound cloud data //
    })
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
      <div className="sidebar__items-container">
        <p className="selected-service">Combine-Music</p>
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
                    const isServiceConnected = userServices.includes(i.value)
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
                        onClick={() => {
                          if (!reqItem.isServiceConnector) {
                            history.push(`/home/${i.value}/${userServices[0]}`)
                          } else {
                            if (i.type === "connect") {
                              if (isServiceConnected) {
                                // disconnect and refresh
                              } else {
                                if (i.value === "spotify") {
                                  loginSpotify()
                                }
                                if (i.value === "soundcloud") {
                                  handleSoundCloudLogin()
                                }
                              }
                            }
                            if (i.type === "visit") {
                              window
                                .open(`https://${i.value}.com`, "_blank")
                                .focus()
                            }
                          }
                        }}
                      >
                        {i.label}
                        {reqItem.isServiceConnector && (
                          <>
                            {i.type === "connect" && (
                              <>
                                {!isServiceConnected && <p>Connect</p>}
                                {isServiceConnected && <p>Disconnect</p>}
                              </>
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
      {/* <a href={SPOTIFY_LOGIN_LINK}>Login Spotify</a>
      <Button
        onClick={() => handleSoundCloudAuth()}
        label={"Login Soundcloud"}
      /> */}
    </div>
  )
}
