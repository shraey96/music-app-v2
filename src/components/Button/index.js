import React from "react"
import "./style.scss"
export const Button = ({ label = "Click Me", onClick }) => {
  return (
    <button
      className="button btnBorder btnBlueGreen"
      onClick={() => onClick && onClick()}
    >
      {label}
    </button>
  )
}
