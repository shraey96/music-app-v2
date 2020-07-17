// export const SIDEBAR_ITEMS = {
//   section1: {
//     label: "Music",
//     items: [
//       {
//         label: "Playlists",
//         value: "playlists",
//       },
//       {
//         label: "Likes",
//         value: "likes",
//       },
//       {
//         label: "Discover",
//         value: "discover",
//       },
//     ],
//   },
//   section2: {
//     label: "Music Services",
//     isServiceConnector: true,
//     items: [
//       {
//         label: "Spotify",
//         value: "spotify",
//       },
//       {
//         label: "Soundcloud",
//         value: "Soundcloud",
//       },
//     ],
//   },
// }

export const SIDEBAR_ITEMS = {
  section1: {
    label: "Music",
    value: "music",
    items: [
      {
        label: "Playlists",
        value: "playlists",
      },
      {
        label: "Likes",
        value: "likes",
      },
      {
        label: "Discover",
        value: "discover",
      },
    ],
  },
  section2: {
    label: "Spotify",
    value: "spotify",
    isServiceConnector: true,
    items: [
      {
        label: "Vist Spotify",
        value: "spotify",
        type: "visit",
      },
      {
        label: "",
        value: "spotify",
        type: "connect",
      },
    ],
  },
  section3: {
    label: "SoundCloud",
    value: "soundcloud",
    isServiceConnector: true,
    items: [
      {
        label: "Vist Soundcloud",
        value: "soundcloud",
        type: "visit",
      },
      {
        label: "",
        value: "soundcloud",
        type: "connect",
      },
    ],
  },
}
