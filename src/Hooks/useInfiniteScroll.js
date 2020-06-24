import React, { useState, useEffect, useRef } from "react"
import { paginateArray } from "utils/helpers"

export const useInfiniteScroll = ({ data = [], type }) => {
  const dataCopy = [...(data || [])]
  const dataLen = useRef(dataCopy.length)
  const [reqData, setReqData] = useState([])
  const [isFetching, setIsFetching] = useState(false)
  const [hasNext, setHasNext] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    managePagination()
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    managePagination()
    // setReqData([])
  }, [data.length])

  useEffect(() => {
    managePagination()
  }, [page])

  const managePagination = () => {
    const paginatedData = paginateArray(dataCopy, page)
    if (paginatedData.length > 0) {
      setReqData([...reqData, ...paginatedData])
    } else {
      setHasNext(false)
    }
    setIsFetching(false)
  }

  const handleScroll = () => {
    const pageHeight = document.body.offsetHeight
    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop

    if ((scrollTop / pageHeight) * 100 > 60) {
      if (!isFetching && hasNext) {
        setIsFetching(true)
        setPage((page) => page + 1)
      }
    }
  }
  // console.log(202020, reqData)
  return { reqData }
}
