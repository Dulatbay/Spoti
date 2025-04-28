import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
    return (
        <header className="bg-gray-900 text-white p-4">
            <div className="max-w-screen-xl mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold">
                    <Link to="/" className="text-white hover:text-yellow-500">Music App</Link>
                </h1>
                <nav className="space-x-6">
                    <Link to="/" className="text-lg hover:text-yellow-500">Home</Link>
                    <Link to="/news" className="text-lg hover:text-yellow-500">Music News</Link>
                    {/*<Link to="/albums" className="text-lg hover:text-yellow-500">Albums</Link>*/}
                    {/*<Link to="/player/1" className="text-lg hover:text-yellow-500">Player</Link>*/}
                </nav>
            </div>
        </header>
    );
};

export default Header;
