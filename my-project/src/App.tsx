// src/App.tsx
import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import SpotifyLogin from './components/SpotifyLogin';
import SpotifyCallback from './pages/SpotifyCallback';
import SpotifyPlayer from './components/SpotifyPlayer';
import SearchInput from "./components/SearchInput.tsx";

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<SpotifyLogin/>}/>
                <Route path="/callback" element={<SpotifyCallback/>}/>
                <Route path="/player" element={<SpotifyPlayer/>}/>
                <Route path="/search" element={<SearchInput />}/>
            </Routes>
        </Router>
    );
};

export default App;
