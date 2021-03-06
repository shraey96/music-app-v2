import axios from "axios"

import { BroadcastChannel } from "broadcast-channel"

import store from "redux-app/store"

import {
  addUserMusicService,
  setSpotifyLikes,
  setSpotifyPlaylists,
} from "redux-app/actions"

import { getClientInfo } from "./helpers"

const appCreds = getClientInfo("spotify")
const spotifyChannel = new BroadcastChannel("SPOTIFY_CHANNEL")

const SPOTIFY_CLIENT_ID = appCreds.cId
const SPOTIFY_CLIENT_SECRET = `b2bcec9b2d0047b5b83df0d2ee04e688`
const SPOTIFY_SCOPES = `scope=playlist-read-collaborative playlist-modify-public playlist-read-private playlist-modify-private user-library-modify user-library-read user-top-read user-read-recently-played user-follow-read user-follow-modify streaming`
const SPOTIFY_REDIRECT_URI = appCreds.rU
const SPOTIFY_LOGIN_LINK = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&${SPOTIFY_SCOPES}&redirect_uri=${SPOTIFY_REDIRECT_URI}`

const spotifyAxios = axios.create()

spotifyAxios.interceptors.response.use(undefined, (err) => {
  const orignalRequest = err.response ? err.response.config : {}
  if (err.response !== undefined && err.response.status === 401) {
    return new Promise(async (resolve, reject) => {
      await getSpotifyRefreshToken().catch((err) => reject(err))
      resolve(spotifyAxios(orignalRequest))
    })
  }
  return Promise.reject(err.response)
})

const getSpotifyToken = async (code) => {
  const params = new URLSearchParams()
  params.append("grant_type", "authorization_code")
  params.append("code", code)
  params.append("client_id", SPOTIFY_CLIENT_ID)
  params.append("client_secret", SPOTIFY_CLIENT_SECRET)
  params.append("redirect_uri", SPOTIFY_REDIRECT_URI)
  const response = await axios
    .post(`https://accounts.spotify.com/api/token`, params)
    .catch((err) => {
      console.log(err)
      return err
    })
  if (response.data) {
    const { data } = response
    setSpotifyAccessToken(data)
    return data
  }
}

const getSpotifyRefreshToken = async () => {
  const tokenVal = checkSpotifyToken()
  if (!tokenVal) return
  const refresh_token = tokenVal.refresh_token
  const params = new URLSearchParams()
  params.append("grant_type", "refresh_token")
  params.append("refresh_token", refresh_token)
  params.append("client_id", SPOTIFY_CLIENT_ID)
  params.append("client_secret", SPOTIFY_CLIENT_SECRET)

  const response = await axios
    .post(`https://accounts.spotify.com/api/token`, params)
    .catch((err) => {
      console.log(err)
      return err
    })
  if (response.data) {
    const { data } = response
    setSpotifyAccessToken(data)
    return data
  }
}

const setSpotifyAccessToken = (data) => {
  localStorage.setItem(
    "spotify_creds",
    JSON.stringify({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    })
  )
  setSpotifyTokenHeader(data.access_token)
}

const setSpotifyTokenHeader = (token) => {
  spotifyAxios.defaults.headers["Authorization"] = `Bearer ${token}`
}

const checkSpotifyToken = () => {
  return JSON.parse(localStorage.getItem("spotify_creds")) || false
}

const getSpotifyLikes = async ({
  pURL,
  baseCollection = [],
  withDispatch = false,
} = {}) => {
  let baseCollectionClone = [...baseCollection]

  const response = await spotifyAxios
    .get(pURL || `https://api.spotify.com/v1/me/tracks?limit=50`)
    .catch((err) => {
      console.log(err)
      return err
    })

  if (response.data && response.data.items)
    if (response.data.next) {
      baseCollectionClone = [...baseCollectionClone, ...response.data.items]

      return getSpotifyLikes({
        pURL: response.data.next,
        baseCollection: baseCollectionClone,
        withDispatch,
      })
    } else {
      baseCollectionClone = [...baseCollectionClone, ...response.data.items]
      const final = baseCollectionClone.reduce((a, b) => {
        return (
          (a[b.track.id] = {
            ...b.track,
            liked_at: b.created_at,
            trackType: "spotify",
          }),
          a
        )
      }, {})
      if (withDispatch) {
        store.dispatch(
          setSpotifyLikes({
            spotifyLikes: final,
          })
        )
      }
      return final
    }
}

const getSpotifyPlaylists = async ({
  pURL,
  baseCollection = [],
  withDispatch = false,
} = {}) => {
  let baseCollectionClone = [...baseCollection]

  const response = await spotifyAxios
    .get(pURL || `https://api.spotify.com/v1/me/playlists?limit=50`)
    .catch((err) => {
      console.log(err)
      return err
    })
  if (response.data && response.data.items)
    if (response.data.next) {
      baseCollectionClone = [...baseCollectionClone, ...response.data.items]

      return getSpotifyPlaylists({
        pURL: response.data.next,
        baseCollection: baseCollectionClone,
        withDispatch,
      })
    } else {
      baseCollectionClone = [...baseCollectionClone, ...response.data.items]
      if (withDispatch) {
        store.dispatch(
          setSpotifyPlaylists({
            spotifyPlaylists: baseCollectionClone,
          })
        )
      }
      return baseCollectionClone
    }
}

const getSpotifyPlaylistTracks = async (
  pURL,
  playlistId,
  baseCollection = []
) => {
  let baseCollectionClone = [...baseCollection]
  const response = await spotifyAxios.get(pURL).catch((err) => {
    return err
  })
  if (response.data) {
    if (response.data.next) {
      baseCollectionClone = [...baseCollectionClone, ...response.data.items]
      return getSpotifyPlaylistTracks(
        response.data.next,
        playlistId,
        baseCollectionClone
      )
    } else {
      baseCollectionClone = [...baseCollectionClone, ...response.data.items]
      return baseCollectionClone.map((t) => ({
        ...t.track,
        trackType: "spotify",
        playlistId: playlistId,
      }))
    }
  }
}

const playSpotifyTrack = ({
  spotify_uri,
  playerInstance: {
    _options: { id },
  },
}) => {
  return spotifyAxios.put(
    `https://api.spotify.com/v1/me/player/play?device_id=${id}`,
    {
      uris: [spotify_uri],
    }
  )
}

const playSpotifyTrackComponent = ({
  uri,
  trackIndex = 0,
  playQueue = [],
  trackId,
  trackInfo,
  playlistId,
}) => {
  spotifyChannel.postMessage({
    type: "playTrack",
    uri,
    trackIndex,
    playQueue,
    trackId,
    trackInfo,
    playlistId,
  })
}

const spotifyTrackTimeConvertor = (mil) => {
  const minutes = Math.floor(mil / 60000)
  const seconds = ((mil % 60000) / 1000).toFixed(0)
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds
}

const loginSpotify = () => {
  const newwindow = window.open(
    SPOTIFY_LOGIN_LINK,
    "name",
    "height=700,width=420"
  )
  if (window.focus) {
    newwindow.focus()
  }
  return false
}

window.updateSpotifyLogin = () => {
  store.dispatch(addUserMusicService({ service: "spotify" }))
}

export {
  loginSpotify,
  getSpotifyLikes,
  getSpotifyToken,
  checkSpotifyToken,
  setSpotifyAccessToken,
  playSpotifyTrack,
  playSpotifyTrackComponent,
  getSpotifyPlaylists,
  spotifyTrackTimeConvertor,
  getSpotifyPlaylistTracks,
  spotifyAxios,
  SPOTIFY_LOGIN_LINK,
}
