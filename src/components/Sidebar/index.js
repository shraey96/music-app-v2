import React from "react"
import { useSelector } from "react-redux"

import { SIDEBAR_ITEMS } from "utils/constants"

import "./style.scss"

export const Sidebar = () => {
  const userInfo = useSelector((state) => state.user.userInfo)

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
                    <div key={i.value} className="sidebar__section__item">
                      {i.label}
                      {reqItem.isServiceConnector && (
                        <>
                          {!userInfo.services.includes(i.value) && (
                            <p>connect</p>
                          )}
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
