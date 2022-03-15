import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Header from '../../header/header'
import SearchBar from '../../searchBar/searchBar'
import { faMusic } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './search.css'
import Song from '../../../models/song'
import SongList from '../../songList/songList'
// https://mui.com/components/progress/#linear-indeterminate
import LinearProgress from '@mui/material/LinearProgress'
import Cookies from 'universal-cookie'

function Search() {

  // https://stackoverflow.com/a/43684059/17712310
  const cookies = useMemo(() => new Cookies(), [])

  // --------------------------------------- SERVICES ---------------------------------------

  // https://blog.logrocket.com/async-await-in-typescript/
  const fetchSongs = async (term: string) => {
    const baseURL = "https://itunes.apple.com/search"
    
    // https://www.youtube.com/watch?v=T3Px88x_PsA
    const response = await fetch(baseURL + `?term=${term}`)
    const json = await response.json()

    return json.results
  }

  // --------------------------------------- STATE ---------------------------------------

  // https://dev.to/savagepixie/how-to-mimic-componentdidupdate-with-react-hooks-3j8c
  const didMountRef = useRef(false)

  const [searchTerm, setSearchTerm] = useState('')
  // https://stackoverflow.com/a/65508954/17712310
  const [songsFound, setSongsFound] = useState<Song[]>([])

  const [loading, setLoading] = useState(false)

  // --------------------------------------- EVENT HANDLERS ---------------------------------------

  // https://www.freecodecamp.org/news/pass-data-between-components-in-react/
  const onSearch = (term: string) => {
    setSearchTerm(term)
  }

  // https://stackoverflow.com/a/64500260/17712310
  const onSearchTermChange = useCallback(() => {
    // show loading indicator
    setLoading(true)

    // set search term cookie
    cookies.set("lastSearchTerm", searchTerm, {path: '/'})

    fetchSongs(searchTerm).then((songsData: any[]) => {
      let initializedSongs: Song[] = songsData.map(data => {
        let song = new Song()
        song.title = data.trackCensoredName
        song.artist = data.artistName
        song.art = data.artworkUrl100
        song.id = data.trackId
        return song
      })
      setLoading(false)
      setSongsFound(initializedSongs)
    })
  }, [cookies, searchTerm])

  useEffect(() => {

    // https://dev.to/savagepixie/how-to-mimic-componentdidupdate-with-react-hooks-3j8c
    // update lifecycle
    if(didMountRef.current){
      onSearchTermChange()
    }
    // mount lifecycle
    else {
      didMountRef.current = true
      // load last search page stuff if appropriate
      const referrer = document.referrer
      let lastSearchTerm = cookies.get('lastSearchTerm')
      if(referrer === "" && lastSearchTerm !== "undefined"){
        setSearchTerm(lastSearchTerm)
      }
    }
  }, [searchTerm, cookies, onSearchTermChange])

  const onSearchEnter = (e: any, newSearchTerm: string) => {
    if(e.code === "Enter"){
      setSearchTerm(newSearchTerm)
    }
  }

  return (
    <React.Fragment>
      <Header styles={{position: "fixed"}}>
        <FontAwesomeIcon icon={faMusic} color="#fff" id="siteLogo"/>
        <SearchBar term={searchTerm} styles={{width: "50%", height: "35px", marginLeft: "auto", marginRight: "auto"}} searchHandler={onSearch} enterHandler={onSearchEnter}/>
      </Header>
      <div id="body">
        <SongList songs={songsFound}/>
      </div>
      {/* https://stackoverflow.com/a/63882823/17712310 */}
      {
        loading && 
        <LinearProgress id="progress-bar"/>
      }
    </React.Fragment>
  )
}

export default Search