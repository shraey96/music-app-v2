import axios from "axios"

import store from "redux-app/store"

import { addUserMusicService } from "redux-app/actions"

import { getClientInfo } from "./helpers"

const appCreds = getClientInfo("soundcloud")

const proxyURL = window.location.href.includes("localhost")
  ? `https://cryptic-ravine-67258.herokuapp.com/`
  : ""

const SOUNDCLOUD_CLIENT_ID = appCreds.cId
const SOUNDCLOUD_REDIRECT_URL = appCreds.rU

const APP_BASE_API_ROUTE = `http://localhost:3009/api`

const soundCloudAxios = axios.create()

const setSoundCloudTokenHeader = (token) => {
  soundCloudAxios.defaults.headers.common["Authorization"] = `OAuth ${token}`
  localStorage.setItem("sc_accessToken", token)
}

const checkSoundCloudAccessToken = () => {
  return localStorage.getItem("sc_accessToken") || false
}

/**
Soundcloud Helpers 
*/

// Soundcloud AJAX Helpers //

const getSCMeLikedTracks = async (url, baseCollection = []) => {
  try {
    const response = await soundCloudAxios
      .post(APP_BASE_API_ROUTE + `/appsc/likes`, {
        url:
          url ||
          "https://api-v2.soundcloud.com/users/136003315/track_likes?limit=200&linked_partitioning=1",
      })
      .catch((err) => {
        console.log(555, err)
        return err
      })

    // const response = await soundCloudAxios.get(route).catch((err) => {
    //   console.log(err)
    // })

    if (!response) return

    let baseCollectionClone = [...baseCollection]

    if (response.data.next_href) {
      baseCollectionClone = [
        ...baseCollectionClone,
        ...response.data.collection,
      ]
      return getSCMeLikedTracks(response.data.next_href, baseCollectionClone)
    } else {
      baseCollectionClone = [
        ...baseCollectionClone,
        ...response.data.collection,
      ]

      console.log(234, baseCollectionClone)

      // v2
      return baseCollectionClone.reduce((a, b) => {
        return (
          (a[b.track.id] = {
            ...b.track,
            liked_at: b.created_at,
            trackType: "soundcloud",
          }),
          a
        )
      }, {})

      // v1
      // return baseCollectionClone.reduce((a, b) => {
      //   return (
      //     (a[b.id] = { ...b, liked_at: b.created_at, trackType: "soundcloud" }),
      //     a
      //   )
      // }, {})

      //
    }
  } catch (error) {
    return error
  }
}

const getSCUserLikedTracks = async (uid, baseCollection = []) => {
  const url =
    proxyURL +
    `https://api-v2.soundcloud.com/users/${uid}/track_likes?limit=200&linked_partitioning=1`
  let baseCollectionClone = [...baseCollection]
  const response = await soundCloudAxios.get(proxyURL + url).catch((err) => {
    console.log(err)
  })

  if (response.data.next_href) {
    baseCollectionClone = [...baseCollectionClone, ...response.data.collection]
    return getSCUserLikedTracks(
      uid,
      response.data.next_href,
      baseCollectionClone
    )
  } else {
    baseCollectionClone = [...baseCollectionClone, ...response.data.collection]

    return baseCollectionClone.reduce((a, b) => {
      return (a[b.track.id] = { ...b.track, liked_at: b.created_at }), a
    }, {})
  }
}

const getSCUserPlaylist = async (uid, pURl, baseCollection = []) => {
  const url =
    pURl ||
    `https://api-v2.soundcloud.com/users/${uid}/playlists/liked_and_owned?client_id=${SOUNDCLOUD_CLIENT_ID}&limit=200&offset=0`
  let baseCollectionClone = [...baseCollection]
  const response = await soundCloudAxios.get(proxyURL + url).catch((err) => {
    console.log(err)
  })
  if (response.data.next_href) {
    baseCollectionClone = [...baseCollectionClone, ...response.data.collection]

    return getSCUserPlaylist(uid, response.data.next_href, baseCollectionClone)
  } else {
    baseCollectionClone = [...baseCollectionClone, ...response.data.collection]
    return baseCollectionClone
  }
}

const getSCPlaylistTracks = async (playlistId) => {
  const playListData = await soundCloudAxios
    .get(
      proxyURL +
        `https://api.soundcloud.com/playlists/${playlistId}?client_id=${SOUNDCLOUD_CLIENT_ID}`
    )
    .catch((err) => {
      console.log(err)
    })
  return playListData.data ? playListData.data.tracks : playListData
}

const getPlaylistLikedExp = async (uid) => {
  const result = await soundCloudAxios.get(
    `https://api.soundcloud.com/e1/users/${uid}/playlist_likes?client_id=${SOUNDCLOUD_CLIENT_ID}`
  )
  return result
}

const getPlaylistMe = async (uid) => {
  const result = await soundCloudAxios.get(
    `https://api.soundcloud.com/users/${uid}/playlists?client_id=${SOUNDCLOUD_CLIENT_ID}`
  )
  return result
}

const getSoundCloudTrackStreamURL = async (track) => {
  let streamURL = track.stream_url
    ? track.stream_url + `?client_id=${SOUNDCLOUD_CLIENT_ID}`
    : false

  console.log(9999, track)

  if (!streamURL) {
    const streamURLProg =
      ((track.media || {}).transcodings || []).find(
        (x) => x.format.protocol === "progressive"
      ) || {}.url
    // v1
    // const { data } = await soundCloudAxios.get(proxyURL + streamURLProg)

    // v2
    if (streamURLProg) {
      const { data } = await soundCloudAxios.post(
        APP_BASE_API_ROUTE + `/appsc/progressive`,
        {
          url:
            streamURLProg.url + "?client_id=aXd1ix9hLP655AohC5dUIEgxc8GSTWbs",
        }
      )
      streamURL = data.url
    } else {
      streamURL = `https://api.soundcloud.com/tracks/${track.id}/stream?client_id=aXd1ix9hLP655AohC5dUIEgxc8GSTWbs`
    }
  }

  return streamURL
}

const loginSoundcloud = () => {
  return window.SC.connect().then((scAuth) => {
    setSoundCloudTokenHeader(scAuth.oauth_token)
    store.dispatch(addUserMusicService({ service: "soundcloud" }))
  })
}

export {
  soundCloudAxios,
  loginSoundcloud,
  getSCUserLikedTracks,
  getSCUserPlaylist,
  getSCPlaylistTracks,
  SOUNDCLOUD_CLIENT_ID,
  SOUNDCLOUD_REDIRECT_URL,
  setSoundCloudTokenHeader,
  checkSoundCloudAccessToken,
  getPlaylistLikedExp,
  getSoundCloudTrackStreamURL,
  getSCMeLikedTracks,
  getPlaylistMe,
}

// shraey => 136003315
// alphalete workout playlist => 232207406
// test clientID => AT0Y0FFHlzmWSrjMlNUme8fMpLquh5Zi

// https://api.soundcloud.com/me/favorites?limit=200&linked_partitioning=1?format=json&oauth_token=3-278246-136003315-X3YslPWyKonOla
// https://api.soundcloud.com/me/playlists?limit=200&linked_partitioning=1?format=json&oauth_token=3-278246-136003315-X3YslPWyKonOla

// "https://api.soundcloud.com/tracks/243895680/stream?client_id=AKm0rmaY0ScS4y0FyUdvWMyfmtMdUYh6"
// https://api-v2.soundcloud.com/me/library/albums_playlists_and_system_playlists?client_id=AKm0rmaY0ScS4y0FyUdvWMyfmtMdUYh6&limit=100&offset=0&linked_partitioning=1&app_version=1593096385&app_locale=en
// https://api-v2.soundcloud.com/users/136003315/track_likes?limit=200&linked_partitioning=1
