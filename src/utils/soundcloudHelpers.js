import axios from "axios"

const proxyURL = `https://cryptic-ravine-67258.herokuapp.com/`
const scToken = `2-291187-136003315-gUg1W5fEs2g6Qr`

const appBase = {}

/**
Soundcloud Helpers 
*/

// Soundcloud AJAX Helpers //

const soundcloudAxios = axios.create({
  headers: { Authorization: `OAuth ${scToken}` }
})

const getSCUserLikedTracks = async (uid, lURl, baseCollection = []) => {
  const url =
    lURl ||
    `https://api-v2.soundcloud.com/users/${uid}/track_likes?limit=200&linked_partitioning=1`
  let baseCollectionClone = [...baseCollection]
  const response = await soundcloudAxios.get(proxyURL + url).catch(err => {
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
    `https://api-v2.soundcloud.com/users/${uid}/playlists/liked_and_owned?client_id=${appBase.clientId}&limit=200&offset=0`
  let baseCollectionClone = [...baseCollection]
  const response = await soundcloudAxios.get(proxyURL + url).catch(err => {
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

const getSCPlaylistTracks = async playlistId => {
  const playListData = await soundcloudAxios
    .get(
      proxyURL +
        `https://api.soundcloud.com/playlists/${playlistId}?client_id=${appBase.clientId}`
    )
    .catch(err => {
      console.log(err)
    })
  return playListData
}

// Time Helpers //
const formatAudioTime = time => {
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

export {
  soundcloudAxios,
  getSCUserLikedTracks,
  getSCUserPlaylist,
  getSCPlaylistTracks,
  formatAudioTime
}

// shraey => 136003315
// alphalete workout playlist => 232207406
// test clientID => AT0Y0FFHlzmWSrjMlNUme8fMpLquh5Zi
