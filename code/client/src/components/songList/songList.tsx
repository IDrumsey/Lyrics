import React from 'react'
import Song from '../../models/song'
import SongCard from '../SongCard/SongCard'
import './songList.css'

function SongList(props: {songs: Song[]}) {
    
  return (
    <div id="song-list">
      {/* https://www.youtube.com/watch?v=JDuYnDHWLD8 */}
      {
        props.songs.map((song, i) => {
          return (
            <SongCard song={song} key={i} styles={{width: "100%", minHeight: "100px"}}/>
          )
        })
      }
    </div>
  )
}

export default SongList