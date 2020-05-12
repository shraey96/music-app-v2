import React, { useRef, useEffect } from "react"
import { useHistory, useParams } from "react-router-dom"
import "./style.scss"

export const TabItems = ({ tabs = [] }) => {
  const tabsItemsContainerRef = useRef(null)
  const tabSliderRef = useRef(null)

  const history = useHistory()
  const { service } = useParams()

  //   useEffect(() => {
  //     const reqWidth = tabsItemsContainerRef.current.querySelector(
  //       ".tab-item--active"
  //     )
  //     if (reqWidth) {
  //         tabSliderRef.current.style.width = 100
  //     }
  //   }, [])

  useEffect(() => {
    const activeIndex = tabs.findIndex((f) => f.value.includes(service))
    tabSliderRef.current.style.left = activeIndex * 140 + "px"
  }, [service])

  return (
    <div className="tabs-container">
      <div className="tab-items-container" ref={tabsItemsContainerRef}>
        {tabs.map((t) => {
          return (
            <div
              className={`tab-item ${
                t.value.includes(service) && "tab-item--active"
              }`}
              onClick={() => history.push(t.value)}
            >
              {t.label}
            </div>
          )
        })}
        <div className="tab-active-slider" ref={tabSliderRef} />
      </div>
    </div>
  )
}
