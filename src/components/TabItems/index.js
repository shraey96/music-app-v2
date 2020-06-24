import React, { useRef, useEffect } from "react"
import { useHistory, useParams } from "react-router-dom"
import "./style.scss"

export const TabItems = ({ tabs = [], withScroll = true }) => {
  const history = useHistory()
  const { service } = useParams()

  const tabsContainerRef = useRef(null)

  const tabsItemsContainerRef = useRef(null)

  const tabSliderRef = useRef(null)

  const handleScroll = (e) => {
    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop

    if (tabsContainerRef.current) {
      const alfaPercent = scrollTop < 40 ? 0 : scrollTop / 100

      tabsContainerRef.current.style.background = `rgba(0,0,0, ${alfaPercent})`
    }
  }

  useEffect(() => {
    if (withScroll) {
      window.addEventListener("scroll", handleScroll)
    }
    return () => document.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const activeIndex = tabs.findIndex((f) => f.value.includes(service))
    tabSliderRef.current.style.left = activeIndex * 140 + "px"
  }, [service])

  return (
    <div className="tabs-container" ref={tabsContainerRef}>
      <div className="tab-items-container" ref={tabsItemsContainerRef}>
        {tabs.map((t) => {
          return (
            <div
              key={t.value}
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
      <div className="search-box-container" />
    </div>
  )
}
