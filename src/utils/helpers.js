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

const localStorageGetter = (key) => {
  return JSON.parse(localStorage.getItem(key))
}

const localStorageSetter = (key, data) => {
  localStorage.setItem(key, data)
}

const paginateArray = (array, page_number) => {
  return array.slice((page_number - 1) * 50, page_number * 50)
}

export {
  getHashParams,
  getQueryParams,
  localStorageGetter,
  localStorageSetter,
  paginateArray,
}
