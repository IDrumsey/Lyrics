import React, { useState } from 'react'
import Song from '../../models/song'
import './SongCard.css'
import { useNavigate } from 'react-router-dom'

function SongCard(props: {song: Song, styles: {}}) {
  const [hovering, setHovering] = useState(false)

  // https://www.kindacode.com/article/programmatically-navigate-using-react-router/
  const navigation = useNavigate()

  const onCardClick = () => {
    // https://thewebdev.info/2022/03/08/how-to-pass-data-when-navigating-programmatically-with-react-router/
    navigation(`/song/${props.song.id}`, {state: props.song})
  }

  return (
    // https://stackoverflow.com/a/30533260/17712310
    <div className={"song-card " + (hovering ? "song-card-hovering" : '')} style={props.styles} onMouseEnter={() => {setHovering(true)}} onMouseLeave={() => {setHovering(false)}} onClick={() => {onCardClick()}}>
        <img src={props.song.art} alt="song artwork" className="song-art"/>
        <div className="song-info-wrapper">
          <p className="song-title">{props.song.title}</p>
          <p className="song-artist">{props.song.artist}</p>
        </div>
    </div>
  )
}

export default SongCard