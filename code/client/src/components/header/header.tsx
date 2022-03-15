import React from 'react'
import './header.css';

function header(props: {styles?: {}, children: any}) {
  return (
    <div id='header' style={props.styles}>
      {/* https://stackoverflow.com/a/53767973/17712310 */}
      {props.children}
    </div>
  )
}

export default header