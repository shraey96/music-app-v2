import React from "react"
import ReactDOM from "react-dom"

import { ICONS } from "../../iconConstants"

import "./style.scss"

export const InputBox = ({
  placeholder = "Search anything",
  value = "",
  type = "text",
  onChange,
  portalRef,
}) => {
  if (!portalRef) return ""
  return ReactDOM.createPortal(
    <div className="search-box">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        className="search-input"
        onChange={(e) => onChange && onChange(e)}
      />
      <a href="#" className="search-btn">
        {ICONS.SEARCH}
      </a>
    </div>,
    portalRef
  )
}
