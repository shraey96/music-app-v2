import axios from "axios"

const userAxios = axios.create()

const setAppAccessToken = (data) => {
  localStorage.setItem(
    "app_token",
    JSON.stringify({
      app_access_token: data.access_token,
      app_refresh_token: data.refresh_token,
    })
  )
  setAppTokenHeader(data.access_token)
}

const setAppTokenHeader = (token) => {
  userAxios.defaults.headers["Authorization"] = `Bearer ${token}`
}

const checkAppToken = () => {
  return JSON.parse(localStorage.getItem("app_token") || false)
}

const getUserAppLikes = () => {}

export { setAppAccessToken, checkAppToken }
