import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import SearchPage from './components/pages/search/search'
import SongPage from './components/pages/song/song'

function App() {
  return (
    <div id="AppComponent">
      <Router>
        <Routes>
          <Route path="/" element={<SearchPage/>} />
          <Route path="/song/:songID"  element={<SongPage/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
