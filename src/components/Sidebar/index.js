import React from "react"
import { useSelector } from "react-redux"
import { useHistory, useParams } from "react-router-dom"

import { SIDEBAR_ITEMS } from "utils/constants"

import { SPOTIFY_LOGIN_LINK } from "utils/spotifyHelpers"

import "./style.scss"

export const Sidebar = () => {
  const history = useHistory()
  const { section } = useParams()

  const userInfo = useSelector((state) => state.user.userInfo)
  const userServices = userInfo.services

  return (
    <div className={`sidebar sidebar--hide`}>
      <div className="sidebar__items-container">
        {Object.keys(SIDEBAR_ITEMS).map((k) => {
          const reqItem = SIDEBAR_ITEMS[k]
          return (
            <div key={k} className="sidebar__section">
              <p className="sidebar__section__label">{reqItem.label}</p>
              <div className="sidebar__sections-items-container">
                {reqItem.items.map((i) => {
                  return (
                    <div
                      key={i.value}
                      className={`sidebar__section__item ${
                        section === i.value && "sidebar__section__item--active"
                      }`}
                      onClick={() =>
                        !reqItem.isServiceConnector &&
                        history.push(`/home/${i.value}/${userServices[0]}`)
                      }
                    >
                      {i.label}
                      {reqItem.isServiceConnector && (
                        <>{!userServices.includes(i.value) && <p>connect</p>}</>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
      <a href={SPOTIFY_LOGIN_LINK}>Login Spotify</a>
    </div>
  )
}
