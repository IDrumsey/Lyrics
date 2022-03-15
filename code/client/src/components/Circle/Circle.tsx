import React from 'react'
import Lyric from '../../models/lyric'
import './Circle.css'

function Circle(props: {color ?: string, size ?: number, lyric: Lyric, clickHandler: any}) {

    let styles = {
        backgroundColor: props.color ? props.color : "#fff",
        width: props.size ? `${props.size}px` : '50px',
        height: props.size ? `${props.size}px` : '50px'
    }

  return (
    // https://flaviocopes.com/react-pass-parameter-event/
    <div className="circle" style={styles} onClick={() => props.clickHandler(props.lyric)}></div>
  )
}

export default Circle