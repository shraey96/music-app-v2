import {
  localStorageGetter,
  localStorageSetter,
  shuffleQueue,
} from "utils/helpers"

const playerInitialState = {
  isAudioPlaying: false,
  isShuffleMode: false,
  isRepeatMode: 0,
  currentTrack: {
    service: "",
    trackId: null,
    trackInfo: {},
  },
  playQueue: [],
  trackIndex: 0,
  playQueueClone: [],
}

const playerReducer = (state = playerInitialState, action) => {
  switch (action.type) {
    case "PLAY_AUDIO":
      return {
        ...state,
        isAudioPlaying:
          action.isAudioPlaying === undefined
            ? state.isAudioPlaying
            : action.isAudioPlaying,
        currentTrack: {
          service: action.trackPayload.service,
          trackId: action.trackPayload.trackId,
          trackInfo: action.trackPayload.trackInfo,
        },
        trackIndex: action.trackIndex || 0,
        playQueue: action.playQueue || [],
        playQueueClone: action.playQueue || [],
      }
    case "TOGGLE_AUDIO_PLAY":
      console.log(1111, action)
      return {
        ...state,
        isAudioPlaying: action.isAudioPlaying,
      }
    case "TOGGLE_SHUFFLE":
      return {
        ...state,
        isShuffleMode: action.isShuffleMode || false,
        playQueue: action.isShuffleMode
          ? shuffleQueue(state.playQueue, state.trackIndex)
          : state.playQueue,
      }
    case "SET_PLAY_QUEUE":
      return {
        ...state,
        playQueue: action.playQueue || [],
        playQueueClone: action.playQueue || [],
      }
    case "SEEK_TRACK":
      const trackIndexNew =
        action.seekType === "forward"
          ? state.trackIndex + 1
          : state.trackIndex === 0
          ? 0
          : state.trackIndex - 1
      const newTrack = state.playQueue[trackIndexNew]
      const currentTrackNew = {
        service: newTrack.trackType,
        trackId: newTrack.trackType === "spotify" ? newTrack.id : 0,
        trackInfo: newTrack,
      }

      return {
        ...state,
        currentTrack: currentTrackNew,
        trackIndex: trackIndexNew,
      }

    case "UPDATE_PLAY_QUEUE":
      if (action.trackIndex && action.type) {
        let playQueueClone = [...state.playQueue]
        if (action.type === "add") {
          playQueueClone[action.trackIndex] = action.track
        }
        if (action.type === "remove") {
          playQueueClone = playQueueClone.filter(
            (z, i) => i !== action.trackIndex
          )
        }
        return { ...state, playQueue: playQueueClone }
      }
      return state

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

    case "SET_SPOTIFY_LIKES":
      return { ...state, spotifyLikes: action.spotifyLikes }

    case "UPDATE_SPOTIFY_LIKES":
      const spotifyLikes = { ...state.spotifyLikes }
      if (action.type === "add") spotifyLikes[action.track.id] = action.track
      if (action.type === "remove") delete spotifyLikes[action.track.id]
      return { ...state, spotifyLikes }

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
