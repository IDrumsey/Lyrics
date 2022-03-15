import React, { useEffect, useState } from 'react'
import './searchBar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

function SearchBar(props: {styles ?: any, searchHandler ?: any, term ?: string, enterHandler ?: any}) {

    // https://www.devhandbook.com/react/forms/
    const [searchValue, updateValue] = useState(props.term)

    // https://www.youtube.com/watch?v=0XSDAup85SA
    // https://www.freecodecamp.org/news/pass-data-between-components-in-react/
    const onSearchBtnClick = () => {
        if(props.searchHandler){
            props.searchHandler(searchValue)
        }
    }

    const onSearchBarChange = (newValue: string) => {
      updateValue(newValue)
    }

    useEffect(() => {
      updateValue(props.term)
    }, [props.term])
    
  return (
        <div id="search-bar-wrapper" style={props.styles}>
          {/* https://www.devhandbook.com/react/forms/ */}
        <input type="text" value={searchValue} onKeyDown={(e) => props.enterHandler(e, searchValue)} onChange={(e) => onSearchBarChange(e.target.value)} id='search-bar'/>
        <FontAwesomeIcon icon={faSearch} id='search-button' onClick={(e) => onSearchBtnClick()} color="#1c1c1c"/>
        </div>
  )
}

export default SearchBar