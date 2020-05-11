import { localStorageGetter, localStorageSetter } from "utils/helpers"

const playerInitialState = {
  isAudioPlaying: false,
  isShuffleMode: false,
  currentTrack: {
    service: "",
    trackId: null,
    trackInfo: {},
  },
}

const playerReducer = (state = playerInitialState, action) => {
  switch (action.type) {
    case "PLAY_AUDIO":
      return {
        ...state,
        isAudioPlaying:
          action.trackPayload.isAudioPlaying || state.isAudioPlaying,
        currentTrack: {
          service: action.trackPayload.service,
          trackId: action.trackPayload.trackId,
          trackInfo: action.trackPayload.trackInfo,
        },
      }
    case "TOGGLE_AUDIO_PLAY":
      return {
        ...state,
        isAudioPlaying: action.isAudioPlaying,
      }
    case "ENABLE_SHUFFLE":
      return { ...state, isShuffleMode: !state.isAudioPlaying }

    default:
      return state
  }
}

const userInitialState = {
  userAuth: localStorageGetter("app_token") || false,
  userInfo: localStorageGetter("app_userInfo") || { email: "", services: [] },
  spotifyLikes: {},
  spotifyPlaylist: {},
  soundcloudLikes: {},
  soundcloudPlaylist: {},
}

const userReducer = (state = userInitialState, action) => {
  switch (action.type) {
    case "LOGIN_USER_SUCCESS":
      localStorageSetter("app_userInfo", JSON.stringify(action.userInfo))
      return {
        ...state,
        userAuth: true,
        userInfo: { ...action.userInfo },
        ...action.payload,
      }

    case "UPDATE_USER_LIKES_SPOTIFY":
      return {
        ...state,
        spotifyLikes: action.payload,
      }

    case "UPDATE_USER_LIKES_SOUNDCLOUD":
      return {
        ...state,
        soundcloudLikes: action.payload,
      }

    default:
      return state
  }
}

export { playerReducer, userReducer }
