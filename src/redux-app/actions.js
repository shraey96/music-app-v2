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

const setUserLogin = (payload) => {
  return {
    type: "LOGIN_USER_SUCCESS",
    userInfo: payload.userInfo,
  }
}

export { playTrack, toggleAudioPlay, setUserLogin }
