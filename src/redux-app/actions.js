const playTrack = ({ trackPayload, trackIndex, playQueue, isAudioPlaying }) => {
  return {
    type: "PLAY_AUDIO",
    trackPayload,
    trackIndex,
    playQueue,
    isAudioPlaying,
  }
}

const seekTrack = (seekType) => {
  return { type: "SEEK_TRACK", seekType }
}

const toggleAudioPlay = (payload) => {
  return {
    type: "TOGGLE_AUDIO_PLAY",
    isAudioPlaying: payload.isAudioPlaying,
  }
}

const toggleShuffle = (isShuffleMode) => {
  return {
    type: "TOGGLE_SHUFFLE",
    isShuffleMode,
  }
}

const setSoundcloudLikes = (payload) => {
  return {
    type: "SET_SOUNDCLOUD_LIKES",
    soundcloudLikes: payload.soundcloudLikes,
  }
}

const setSoundcloudPlaylists = (payload) => {
  console.log(6666, payload)
  return {
    type: "SET_SOUNDCLOUD_PLAYLISTS",
    soundcloudPlaylists: payload.soundcloudPlaylists,
  }
}

const updateSoundcloudLikes = (payload) => {
  return {
    type: "UPDATE_SOUNDCLOUD_LIKES",
    action: payload.action || "add",
    track: payload.track,
  }
}

const setSpotifyLikes = (payload) => {
  return {
    type: "SET_SPOTIFY_LIKES",
    spotifyLikes: payload.spotifyLikes,
  }
}

const setSpotifyPlaylists = (payload) => {
  return {
    type: "SET_SPOTIFY_PLAYLISTS",
    spotifyPlaylists: payload.spotifyPlaylists,
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

const addUserMusicService = (payload) => {
  return {
    type: "ADD_USER_SERVICE",
    service: payload.service,
  }
}

export {
  playTrack,
  toggleAudioPlay,
  seekTrack,
  toggleShuffle,
  setSpotifyLikes,
  setSpotifyPlaylists,
  updateSpotifyLikes,
  setUserLogin,
  addUserMusicService,
  //
  setSoundcloudLikes,
  setSoundcloudPlaylists,
  updateSoundcloudLikes,
}
