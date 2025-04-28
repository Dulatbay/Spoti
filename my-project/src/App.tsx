// src/App.tsx
import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import SearchInput from "./components/SearchInput.tsx";
import AlbumPage from "./pages/AlbumPage.tsx";
import FullScreenPlayer from "./pages/FullScreenPlayer.tsx";
import MusicNewsPage from "./pages/MusicNewsPage.tsx";
import Header from "./components/Header.tsx";

const App: React.FC = () => {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<SearchInput/>}/>
                <Route path="/albums" element={<AlbumPage/>}/>
                <Route path="/player/:id" element={<FullScreenPlayer/>}/>
                <Route path="/news" element={<MusicNewsPage/>}/>
                {/*<Route path="/callback" element={<SpotifyCallback/>}/>*/}
                {/*<Route path="/player" element={<SpotifyPlayer/>}/>*/}
                {/*<Route path="/search" element={<SearchInput />}/>*/}
            </Routes>
        </Router>
    );
};

export default App;
