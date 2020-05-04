const playerInitialState = {
  isAudioPlaying: false,
  playlist: [],
  activeTrackId: null,
  isShuffleMode: false,
  playListReOrder: false
}

const playerReducer = (state = playerInitialState, action) => {
  switch (action.type) {
    case "PLAY_AUDIO":
      return {
        ...state,
        isAudioPlaying: !state.isAudioPlaying,
        activeTrackId: action.payload
      }
    case "ENABLE_SHUFFLE":
      return { ...state, isShuffleMode: !state.isAudioPlaying }
    case "SET_PLAYLIST":
      return {
        ...state,
        playlist: action.payload
      }
    case "REORDER_PLAYLIST":
      return {
        ...state,
        playlist: action.payload,
        playListReOrder: true
      }
    case "REORDER_PLAYLIST_TOGGLE":
      return {
        ...state,
        playListReOrder: !state.playListReOrder
      }

    default:
      return state
  }
}

const userInitialState = {
  userAuth: localStorage.getItem("sc_accessToken") !== null,
  userProfile: {},
  userFollowers: [],
  userFollowing: [],
  userPlaylist: [],
  userLikes: {},
  userPlayHistory: {},
  loading: false
}

const userReducer = (state = userInitialState, action) => {
  switch (action.type) {
    case "USER_AUTH_LOADING":
      return {
        ...state,
        loading: action.payload
      }

    case "LOGIN_USER_SUCCESS":
      return {
        userAuth: true,
        loading: false,
        ...action.payload
      }

    case "UPDATE_USER_LIKES":
      return {
        ...state,
        userLikes: action.payload
      }

    case "USER_FOLLOWING":
      return {
        ...state,
        userFollowing: action.payload
      }

    default:
      return state
  }
}

export { playerReducer, userReducer }
