import { APP_IDS } from "./appIds"

const getHashParams = () => {
  var hashParams = {}
  var e,
    r = /([^&;=]+)=?([^&;]*)/g,
    q = window.location.hash.substring(1)
  while ((e = r.exec(q))) {
    hashParams[e[1]] = decodeURIComponent(e[2])
  }
  return hashParams
}

const getClientInfo = (service) => {
  const isNetlify = window.location.href.includes("netlify")
  if (isNetlify) {
    if (service === "spotify") {
      return {
        cId: APP_IDS.SPOTIFY_NETLIFY_CLIENT_ID,
        rU: APP_IDS.SPOTIFY_NETLIFY_REDIRECT_URI,
      }
    }
    if (service === "soundcloud") {
      return {
        cId: APP_IDS.SOUNDCLOUD_NETLIFY_CLIENT_ID,
        rU: APP_IDS.SOUNDCLOUD_NETLIFY_REDIRECT_URI,
      }
    }
  } else {
    if (service === "spotify") {
      return {
        cId: APP_IDS.SPOTIFY_LOCAL_CLIENT_ID,
        rU: APP_IDS.SPOTIFY_LOCAL_REDIRECT_URI,
      }
    }
    if (service === "soundcloud") {
      return {
        cId: APP_IDS.SOUNDCLOUD_LOCAL_CLIENT_ID,
        rU: APP_IDS.SOUNDCLOUD_LOCAL_REDIRECT_URI,
      }
    }
  }
}

const getQueryParams = (rUrl, p) => {
  const url = new URL(rUrl)
  return url.searchParams.get(p)
}

const localStorageGetter = (key) => {
  return JSON.parse(localStorage.getItem(key))
}

const localStorageSetter = (key, data) => {
  localStorage.setItem(key, data)
}

const paginateArray = (array, page_number) => {
  return array.slice((page_number - 1) * 50, page_number * 50)
}

const formatAudioTime = (time) => {
  // time in seconds
  // time = Math.round(time)

  let hrs = ~~(time / 3600)
  let mins = ~~((time % 3600) / 60)
  let secs = ~~time % 60
  let ret = ""

  if (hrs > 0) {
    ret += "" + hrs + ":" + (mins < 10 ? "0" : "")
  }

  ret += "" + mins + ":" + (secs < 10 ? "0" : "")
  ret += "" + secs
  return ret
}

const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max))
}

const shuffleArray = (arr) => {
  const arrLen = arr.length
  return [...arr].sort((a, b) => {
    return getRandomInt(arrLen) - getRandomInt(arrLen)
  })
}

const shuffleQueue = (arr, index) => {
  const arrB = arr.filter((_, i) => i < index)
  const arrA = arr.filter((_, i) => i > index)
  const arrC = [arr[index]]
  return [...shuffleArray(arrB), ...arrC, ...shuffleArray(arrA)]
}

export {
  getHashParams,
  getQueryParams,
  localStorageGetter,
  localStorageSetter,
  paginateArray,
  formatAudioTime,
  shuffleQueue,
  getClientInfo,
}
