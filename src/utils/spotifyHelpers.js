import axios from "axios"

const spotifyAxios = axios.create()

const getSpotifyToken = async (code) => {
  const params = new URLSearchParams()
  params.append("grant_type", "authorization_code")
  params.append("code", code)
  params.append("client_id", "28bc6211497a4a93a51866c234ed3e40")
  params.append("client_secret", "b2bcec9b2d0047b5b83df0d2ee04e688")
  params.append("redirect_uri", window.location.origin + "/")
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
      spotify_access_token: data.access_token,
      spotify_refresh_token: data.refresh_token,
    })
  )
  setSpotifyTokenHeader(data.access_token)
}

const setSpotifyTokenHeader = (token) => {
  spotifyAxios.defaults.headers["Authorization"] = `Bearer ${token}`
}

const checkSpotifyToken = () => {
  return JSON.parse(localStorage.getItem("spotify_creds") || false)
}

const getSPPlaylistTracks = async (pURL, baseCollection = []) => {
  let baseCollectionClone = [...baseCollection]

  const response = await spotifyAxios
    .get(pURL || `https://api.spotify.com/v1/me/tracks?limit=50`)
    .catch((err) => {
      console.log(err)
      return err
    })

  if (response.data)
    if (response.data.next) {
      baseCollectionClone = [...baseCollectionClone, ...response.data.items]

      return getSPPlaylistTracks(response.data.next, baseCollectionClone)
    } else {
      baseCollectionClone = [...baseCollectionClone, ...response.data.items]
      return baseCollectionClone.reduce((a, b) => {
        return (a[b.track.id] = { ...b.track, liked_at: b.created_at }), a
      }, {})
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

const SPOTIFY_SCOPES = `scope=playlist-read-collaborative playlist-modify-public playlist-read-private playlist-modify-private user-library-modify user-library-read user-top-read user-read-recently-played user-follow-read user-follow-modify streaming`
const SPOTIFY_LOGIN_LINK = `https://accounts.spotify.com/authorize?client_id=28bc6211497a4a93a51866c234ed3e40&response_type=code&${SPOTIFY_SCOPES}&redirect_uri=http://localhost:3000/`

export {
  getSPPlaylistTracks,
  getSpotifyToken,
  checkSpotifyToken,
  setSpotifyTokenHeader,
  playSpotifyTrack,
  SPOTIFY_LOGIN_LINK,
}
