import React from "react"
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"
import { BroadcastChannel } from "broadcast-channel"

import { TrackItem } from "components"

import { playTrack, toggleAudioPlay } from "redux-app/actions"

import { getSPPlaylistTracks, playSpotifyTrack } from "utils/spotifyHelpers"

import "./style.scss"

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

    const { access_token } = storageSpotifyToken

    this.spotifyToken = access_token
    this.bindSpotifyPlayer()
    this.getUserTracks()
  }

  bindSpotifyPlayer = () => {
    window.onSpotifyWebPlaybackSDKReady = () => {
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
            trackInfo: trackState.track_window.current_track,
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

      this.spotifyPlayer.connect()

      const spotifyChannel = new BroadcastChannel("SPOTIFY_PLAY_TRACK")
      spotifyChannel.onmessage = (msg) => {
        console.log(111, msg)
        playSpotifyTrack({
          spotify_uri: msg.uri,
          playerInstance: this.spotifyPlayer,
        })
      }
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
    console.log(5050, this.spotifyPlayer, this.spotifyToken)
    return (
      <>
        <div className="tracks-container">
          {spotifyLikes.map((t) => {
            return <TrackItem trackInfo={t} />
          })}
        </div>
        <div className="audio-player"></div>
        {/* <audio
          src={}
          style={{ display: "none" }}
          ref={(ref) => (this.audioRef = ref)}
        /> */}
      </>
    )
  }
}

AudioPlayer = withRouter(
  connect((state) => state, { playTrack, toggleAudioPlay })(AudioPlayer)
)

export { AudioPlayer }
