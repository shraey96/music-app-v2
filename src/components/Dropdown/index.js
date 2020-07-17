import React, { Component } from "react"
import { ICONS } from "iconConstants"
import "./style.scss"

class Dropdown extends Component {
  constructor() {
    super()
    this.timer = null
    this.state = {
      open: false,
      alignRight: false,
    }
  }

  componentDidMount() {
    window.addEventListener("mousedown", this.handleClickOutside, false)
    window.addEventListener("resize", this.detectViewport, false)
  }

  componentWillUnmount() {
    window.removeEventListener("mousedown", this.handleClickOutside, false)
    window.removeEventListener("resize", this.detectViewport, false)
  }

  show() {
    const { onOpen } = this.props
    this.setState(
      {
        open: true,
      },
      () => {
        onOpen && onOpen()
      }
    )
  }

  hide() {
    const { onClose } = this.props
    this.setState(
      {
        open: false,
      },
      () => {
        onClose && onClose()
      }
    )
  }

  detectViewport = (e) => {
    if (this.state.open) {
      const drop = this.dropRef
      var rect = drop.getBoundingClientRect()
      var winWidth =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth
      if (rect.left + drop.clientWidth > winWidth) {
        this.setState({
          alignRight: true,
        })
      } else {
        this.setState({
          alignRight: false,
        })
      }
    }
  }

  handleClickOutside = (e) => {
    if (this.state.open && this.menuRef && !this.menuRef.contains(e.target)) {
      const { onClose } = this.props
      this.setState(
        {
          open: false,
        },
        () => {
          onClose && onClose()
        }
      )
    }
  }

  render() {
    const {
      toggle,
      showArrow = true,
      size,
      actions,
      onClick,
      rightAligned,
      disableAutoHide,
      hideOnMouseOut,
      onOpen,
      onClose,
    } = this.props
    const { open, alignRight } = this.state
    return (
      <div
        ref={(ref) => (this.menuRef = ref)}
        className={`dropdown dropdown--${size} ${open && "open"}`}
        onClick={(e) => e.stopPropagation()}
        onMouseLeave={(e) => {
          if (hideOnMouseOut) {
            this.timer = setTimeout(() => {
              this.hide()
            }, 600)
          }
        }}
        onMouseEnter={() => {
          this.timer && clearTimeout(this.timer)
        }}
      >
        <div
          className="dropdown-toggle"
          onClick={(e) =>
            this.setState({ open: !open }, () => {
              this.state.open && onOpen && onOpen()
              !this.state.open && onClose && onClose()
              this.detectViewport()
            })
          }
        >
          {toggle || (
            <span className="dropdown-toggle__dots">{ICONS.H_DOTS}</span>
          )}
        </div>
        <div
          ref={(ref) => (this.dropRef = ref)}
          className={`dropdown-drop ${
            rightAligned || (alignRight && "right-aligned")
          } ${showArrow && "with-arrow"}`}
        >
          <div className="dropdown-drop__wrap">
            {actions.map((action, i) => {
              const { id, items, hide } = action
              if (hide) {
                return null
              } else {
                return (
                  <ul
                    key={`dropdown-section-${id}-${i}`}
                    className="dropdown-section"
                    id={id}
                  >
                    {items.map((item, j) => {
                      const { key, label, disabled, isDanger, hide } = item
                      if (hide) {
                        return null
                      } else {
                        return (
                          <li
                            key={`dropdown-item-${j}-${key}`}
                            // className={classNames(`dropdown-item`, {
                            //   danger: isDanger,
                            //   disabled: disabled,
                            // })}
                            className={`dropdown-item ${
                              disabled && "disabled"
                            }`}
                            htmlFor={key}
                          >
                            <div
                              onClick={(e) => {
                                e.stopPropagation()
                                e.preventDefault()
                                if (!disabled && onClick) {
                                  onClick(key)
                                  !disableAutoHide &&
                                    this.setState({ open: false }, () => {
                                      onClose && onClose()
                                    })
                                }
                              }}
                            >
                              {label}
                            </div>
                          </li>
                        )
                      }
                    })}
                  </ul>
                )
              }
            })}
          </div>
        </div>
      </div>
    )
  }
}

export { Dropdown }
