const playTrack = ({ trackPayload }) => {
  console.log("payload==> ", trackPayload)
  return (dispatch) => {
    dispatch({ type: "PLAY_AUDIO", trackPayload })
  }
}

const toggleAudioPlay = (payload) => {
  return (dispatch) => {
    dispatch({
      type: "TOGGLE_AUDIO_PLAY",
      isAudioPlaying: payload.isAudioPlaying,
    })
  }
}

const setSpotifyLikes = (payload) => {
  return {
    type: "SET_SPOTIFY_LIKES",
    spotifyLikes: payload.spotifyLikes,
  }
}

const updateSpotifyLikes = (payload) => {
  return {
    type: "UPDATE_SPOTIFY_LIKES",
    action: payload.action || "add",
    track: payload.track,
  }
}

const setUserLogin = (payload) => {
  return {
    type: "LOGIN_USER_SUCCESS",
    userInfo: payload.userInfo,
  }
}

export {
  playTrack,
  toggleAudioPlay,
  setSpotifyLikes,
  updateSpotifyLikes,
  setUserLogin,
}
