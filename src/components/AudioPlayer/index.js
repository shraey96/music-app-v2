import React from "react"
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"

import { playTrack, toggleAudioPlay } from "redux-app/actions"

import { getQueryParams } from "utils/helpers"
import {
  getSpotifyToken,
  getSPPlaylistTracks,
  setSpotifyTokenHeader,
  playSpotifyTrack,
} from "utils/spotifyHelpers"

class AudioPlayer extends React.Component {
  constructor() {
    super()
    this.state = {}
    this.spotifyToken = null
    this.spotifyPlayer = null
  }

  async componentDidMount() {
    const storageSpotifyToken = JSON.parse(
      localStorage.getItem("spotify_creds") || false
    )

    if (storageSpotifyToken === "undefined" || !storageSpotifyToken) {
      const spotifyCode = getQueryParams(window.location.href, "code")
      if (spotifyCode) {
        await getSpotifyToken(spotifyCode)
        this.props.history.push("/")
      }
    }
    const { spotify_access_token } = storageSpotifyToken
    this.spotifyToken = spotify_access_token
    setSpotifyTokenHeader(spotify_access_token)
    this.bindSpotifyPlayer()
    this.getUserTracks()
  }

  bindSpotifyPlayer = () => {
    console.log("bindSpotifyPlayer")
    window.onSpotifyWebPlaybackSDKReady = () => {
      // You can now initialize Spotify.Player and use the SDK
      this.spotifyPlayer = new window.Spotify.Player({
        name: "Spotify Now's App",
        getOAuthToken: (cb) => {
          cb(this.spotifyToken)
        },
      })

      this.spotifyPlayer.addListener("initialization_error", ({ message }) => {
        console.error(message)
      })
      this.spotifyPlayer.addListener("authentication_error", ({ message }) => {
        console.error(message)
      })
      this.spotifyPlayer.addListener("account_error", ({ message }) => {
        console.error(message)
      })
      this.spotifyPlayer.addListener("playback_error", ({ message }) => {
        console.error(message)
      })

      // Playback status updates
      this.spotifyPlayer.addListener("player_state_changed", (trackState) => {
        console.log(44, trackState)
        this.props.toggleAudioPlay({ isAudioPlaying: !trackState.paused })
        this.props.playTrack({
          trackPayload: {
            service: "spotify",
            trackId: trackState.track_window.current_track.id,
          },
        })
      })

      // Ready
      this.spotifyPlayer.addListener("ready", (d) => {
        console.log("Ready with Device ID", d, d.device_id)
      })

      // Not Ready
      this.spotifyPlayer.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id)
      })

      // Connect to the player!
      this.spotifyPlayer.connect()
    }
  }

  getUserTracks = async () => {
    const tracks = await getSPPlaylistTracks()

    if (tracks) {
      this.setState({
        spotifyLikes: Object.values(tracks),
      })
    }
  }

  render() {
    const { spotifyLikes = [] } = this.state
    console.log(112233, this.state)
    console.log(5050, this.props)
    return (
      <div>
        {spotifyLikes.map((i) => {
          return (
            <div
              onClick={() => {
                playSpotifyTrack({
                  spotify_uri: i.uri,
                  playerInstance: this.spotifyPlayer,
                })
              }}
            >
              <p>{i.name} </p>
              <img src={i.album.images[0].url} />
            </div>
          )
        })}
      </div>
    )
  }
}

AudioPlayer = withRouter(
  connect((state) => state, { playTrack, toggleAudioPlay })(AudioPlayer)
)

export { AudioPlayer }
