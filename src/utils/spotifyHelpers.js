import axios from "axios"

const SPOTIFY_CLIENT_ID = `28bc6211497a4a93a51866c234ed3e40`
const SPOTIFY_SCOPES = `scope=playlist-read-collaborative playlist-modify-public playlist-read-private playlist-modify-private user-library-modify user-library-read user-top-read user-read-recently-played user-follow-read user-follow-modify streaming`
const SPOTIFY_REDIRECT_URI = `http://localhost:3000/callback/spotify/`
const SPOTIFY_LOGIN_LINK = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&${SPOTIFY_SCOPES}&redirect_uri=${SPOTIFY_REDIRECT_URI}`

const spotifyAxios = axios.create()

const getSpotifyToken = async (code) => {
  const params = new URLSearchParams()
  params.append("grant_type", "authorization_code")
  params.append("code", code)
  params.append("client_id", SPOTIFY_CLIENT_ID)
  params.append("client_secret", "b2bcec9b2d0047b5b83df0d2ee04e688")
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
        return (
          (a[b.track.id] = {
            ...b.track,
            liked_at: b.created_at,
            trackType: "spotify",
          }),
          a
        )
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

export {
  getSPPlaylistTracks,
  getSpotifyToken,
  checkSpotifyToken,
  setSpotifyAccessToken,
  playSpotifyTrack,
  SPOTIFY_LOGIN_LINK,
}
