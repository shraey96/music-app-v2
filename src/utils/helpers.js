const getHashParams = () => {
  var hashParams = {}
  var e,
    r = /([^&;=]+)=?([^&;]*)/g,
    q = window.location.hash.substring(1)
  while ((e = r.exec(q))) {
    hashParams[e[1]] = decodeURIComponent(e[2])
  }
  return hashParams
}

const getQueryParams = (rUrl, p) => {
  const url = new URL(rUrl)
  return url.searchParams.get(p)
}

export { getHashParams, getQueryParams }
