import React, { useEffect, useMemo, useRef, useState } from 'react'
import './song.css'
import { useLocation, useNavigate } from 'react-router-dom'
import SongModel from '../../../models/song'
import Lyric from '../../../models/lyric'
import Header from '../../header/header'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMusic, faArrowLeftLong, faCirclePlus, faRectangleXmark, faPenToSquare, faCheck } from '@fortawesome/free-solid-svg-icons'
import Circle from '../../Circle/Circle'
import APIBridge from '../../../services/api'
import LinearProgress from '@mui/material/LinearProgress'

function Song() {
  const navigate = useNavigate()

  // ------------------------------------ SERVICES ------------------------------------

  // https://stackoverflow.com/a/69572913/17712310
  const API_Service = useMemo(() => new APIBridge(), [])

  const updateLyric = async (lyric: Lyric, updatedLyrics: string) => {
    lyric.lyrics = updatedLyrics
    return await API_Service.updateLyric(lyric)
  }

  // https://thewebdev.info/2022/03/08/how-to-pass-data-when-navigating-programmatically-with-react-router/
  const song: SongModel = useLocation().state as SongModel

  // ------------------------------------ STATE ------------------------------------

  const [lyrics, setLyrics] = useState<Lyric[]>([])
  const [showingLyricsPanel, setShowingLyricsPanel] = useState(false)
  const [selectedLyric, setSelectedLyric] = useState<Lyric>()
  const [editingLyric, setEditingLyric] = useState(false)
  const [lyricChanges, setLyricChanges] = useState('')
  const [loading, setLoading] = useState(false)

  // https://dev.to/savagepixie/how-to-mimic-componentdidupdate-with-react-hooks-3j8c
  const didMountRef = useRef(false)

  // ------------------------------------ EVENT HANDLERS ------------------------------------

  useEffect(() => {
    const getLyrics = async () => {
      // get lyrics for this song
      let data = await API_Service.getLyrics(song)

      // get the json data from the response
      let json: any[] = await data.json()

      // initialize lyric objects and push into local array
      let lyrics: Lyric[] = json.map(lyricData => {
        let lyric = new Lyric()
        lyric.id = lyricData.id
        lyric.song = song
        lyric.lyrics = lyricData.content
        
        return lyric
      })
  
      return lyrics
    }

    // onMount
    if(!didMountRef.current){
      didMountRef.current = true
      setLoading(true)
      getLyrics().then((foundLyrics: Lyric[]) => {
        setLyrics(foundLyrics)
        setLoading(false)
      })
    }
    // onUpdate
    else {}
  }, [API_Service, song])

  const onBackBtnClick = () => {
    navigate('/')
  }

  const onLyricBtnClick = (lyric: Lyric) => {
    // provide lyrics panel a lyric reference
    setSelectedLyric(lyric)
    setLyricChanges(lyric.lyrics)

    // show the lyrics panel
    setShowingLyricsPanel(true)

    // disable click events on everything else
    // https://stackoverflow.com/a/49598856/17712310
    const all = document.getElementById("body")
    if(all){
      all.style.pointerEvents = "none"
    }

    const lyricsPanel = document.getElementById("lyrics-panel")
    if(lyricsPanel){
      lyricsPanel.style.pointerEvents = "auto !important"
    }
  }

  const onCloseBtnClick = () => {
    // close lyrics panel
    setShowingLyricsPanel(false)
    
    if(selectedLyric){
      // lyrics text is empty -> delete that lyric -> no reason to store an empty lyric
      if(selectedLyric.lyrics === "" || selectedLyric.lyrics === null) {
        API_Service.deleteLyric(selectedLyric).then(() => {
          // remove deleted lyric from local array
          let pos = lyrics.findIndex(tempLyric => selectedLyric === tempLyric)
          lyrics.splice(pos, 1)
          setLyrics(lyrics)

          // remove lyric reference from lyrics panel
          setSelectedLyric(undefined)
          setLyricChanges('')
        })
      }
    }

    // reset lyrics panel to view mode
    setEditingLyric(false)

    // enable click events on everything
    const all = document.getElementById("body")
    if(all){
      all.style.pointerEvents = "auto"
    }
  }

  const onEditBtnClick = () => {
    // change to edit mode
    setEditingLyric(true)
    // store current lyrics into temp variable so to be able to revert back
    setLyricChanges(selectedLyric?.lyrics || '')
  }

  const onUpdateBtnClick = () => {
    // nothing was actually changed -> no api request
    if(selectedLyric && selectedLyric.lyrics === lyricChanges) {
      // change to view mode
      setEditingLyric(false)
    }
    // changes made
    if(selectedLyric && selectedLyric.lyrics !== lyricChanges){
      // api request
      updateLyric(selectedLyric, lyricChanges).then((response) => {
        // basic error handling
        if(response.status !== 200){
          alert("Something went wrong.")
        }
        // assumed successful update
        else {
          // change to view mode
          setEditingLyric(false)
        }
      })
    }
  }

  const onAddBtnClick = async () => {
    // create new lyric
    const response = await API_Service.createLyric({
      id: null,
      lyrics: "",
      song: song
    })

    // get the json response - https://stackoverflow.com/a/59555579/17712310
    let json = await response.json()

    // initialize new lyric object
    let newLyric = new Lyric()
    newLyric.id = json.id
    newLyric.song = song
    newLyric.lyrics = json.content || ""

    // add new lyric to array
    lyrics.push(newLyric)
    setLyrics(lyrics)

    // update lyrics panel content reference
    setSelectedLyric(newLyric)
    setLyricChanges("")

    // show lyrics in editing mode
    setEditingLyric(true)

    // open lyrics panel
    setShowingLyricsPanel(true)
  }

  return (
    <React.Fragment>
      <div id="top">
        <Header>
          <FontAwesomeIcon icon={faMusic} color="#fff" id="siteLogo"/>
          {/* <div id="song-image" style={{backgroundImage: `url(${song.art})`}}></div> */}
          <img src={song.art} id="song-image" alt="Song artwork" />
        </Header>
      </div>
      <div id="body">
        <div id="content-wrapper">
          <div id="song-details">
            <p id="song-title">{song.title}</p>
            <p id="song-artist">{song.artist}</p>
          </div>
          <div id="lyric-buttons">
            {/* Add lyric button */}
            <FontAwesomeIcon icon={faCirclePlus} id="add-button" onClick={onAddBtnClick} color="#5a37c2"/>
            {/* Buttons for all the available lyrics */}
            {/* https://www.youtube.com/watch?v=JDuYnDHWLD8 */}
            {
              lyrics.map((lyric, i) => {
                return (
                  <Circle size={35} lyric={lyric} clickHandler={onLyricBtnClick} key={i}/>
                )
              })
            }
          </div>
        </div>
      </div>
      {/* Lyrics panel */}
      {/* https://stackoverflow.com/a/53610555/17712310 */}
      {
        showingLyricsPanel &&
          (
            <div id="lyrics-panel">
              <div id="options-top">
                {
                  !editingLyric &&
                  <FontAwesomeIcon className="lyrics-panel-icon-btn" id="edit-btn" icon={faPenToSquare} onClick={onEditBtnClick}/>
                }
                <FontAwesomeIcon className="lyrics-panel-icon-btn" id="close-btn" icon={faRectangleXmark} onClick={onCloseBtnClick}/>
              </div>
              {
                !editingLyric && 
                <p id="lyrics-content">
                  {selectedLyric?.lyrics}
                </p>
              }
              {
                // https://stackoverflow.com/a/10910850/17712310
                editingLyric && 
                <textarea autoFocus={true} id="lyrics-content-editable" value={lyricChanges} onChange={(e) => setLyricChanges(e.target.value)}></textarea>
              }
              <div id="options-bottom">
                {
                  editingLyric &&
                  <FontAwesomeIcon className="lyrics-panel-icon-btn" id="update-btn" icon={faCheck} onClick={onUpdateBtnClick}/>
                }
              </div>
            </div>
          )
      }
      <FontAwesomeIcon icon={faArrowLeftLong} id="back-arrow" onClick={onBackBtnClick}/>
      {
        loading && 
        <LinearProgress id="progress-bar"/>
      }
    </React.Fragment>
  )
}

export default Song