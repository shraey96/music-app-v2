import React from "react"

import { SIDEBAR_ITEMS } from "utils/constants"

class Sidebar extends React.Component {
  render() {
    return (
      <div className={`sidebar sidebar--hide`}>
        <div className="sidebar__items-container">
          {SIDEBAR_ITEMS.map(item => {
            return <div className="sidebar-item">{item.label}</div>
          })}
        </div>
      </div>
    )
  }
}

export { Sidebar }
