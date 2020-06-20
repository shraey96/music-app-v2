import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { useHistory, useParams } from "react-router-dom"
import { motion } from "framer-motion"

import { SIDEBAR_ITEMS } from "utils/constants"

import { SPOTIFY_LOGIN_LINK } from "utils/spotifyHelpers"

import { ICONS } from "iconConstants"

import "./style.scss"

export const Sidebar = () => {
  const [isMinimized, toggleMinimized] = useState(false)
  const [selectedTab, toggleSelectedTab] = useState("music")
  const history = useHistory()
  const { section } = useParams()

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
        <span
          className={`minimize-toggle ${
            isMinimized && "minimize-toggle--minimized"
          }`}
          onClick={() => toggleMinimized((p) => !p)}
        >
          {ICONS.BACK}
        </span>
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
    </div>
  )
}
