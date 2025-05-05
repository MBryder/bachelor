import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { fetchSearchResults } from '../services/placesService';

type Place = {
    id: string;
    name: string;
    longitude: number;
    latitude: number;
};

function Head({ handleAddPlace }: { handleAddPlace: (place: Place) => void }) {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const debounceTimeout = useRef<number | null>(null);
    const [results, setResults] = useState<Place[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/login');
    };

    const handleSwitchToProfile = () => {
        navigate('/profile');
    };

    useEffect(() => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        if (search.trim() === '') {
            setResults([]);
            setShowDropdown(false);
            return;
        }

        debounceTimeout.current = window.setTimeout(async () => {
            try {
                const fetchedResults = await fetchSearchResults(search);
                setResults(Array.isArray(fetchedResults) ? fetchedResults : []);
                setShowDropdown(true);
            } catch (error) {
                console.error('Error fetching search results:', error);
                setResults([]);
                setShowDropdown(false);
            }
        }, 400);

        return () => {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
        };
    }, [search]);

    return (
        <div className="h-[60px] border-b border-primary-brown flex items-center justify-between px-8 relative">
            {/* Left side - Logo */}
            <div>
                <h1 className="text-display-1 font-display text-primary-brown">NextStop</h1>
            </div>

            {/* Center - Buttons + Search */}
            <div className="flex border-1 border-primary-brown rounded-4xl bg-background-beige1 shadow-lg items-center relative">
                <button
                    onClick={() => navigate('/profile')}
                    className="hover:underline hover:cursor-pointer border-r-1 py-2 px-4 border-primary-brown"
                >
                    <p className="text-primary-brown text-heading-3">My profile</p>
                </button>
                <button
                    onClick={() => navigate('/about')}
                    className="hover:underline hover:cursor-pointer border-x-1 py-2 px-4 border-primary-brown"
                >
                    <p className="text-primary-brown text-heading-3">About</p>
                </button>

                {/* Search Input */}
                <div className="relative w-64">
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search"
                        className="w-full hover:cursor-pointer border-l-1 py-2 px-4 border-primary-brown text-primary-brown text-heading-3 focus:rounded-bl-none focus:outline-none"
                        onFocus={() => { if (results.length > 0) setShowDropdown(true); }}
                        onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                    />
                    {showDropdown && results.length > 0 && (
                        <ul className="absolute top-full left-0 right-0 bg-white border border-primary-brown rounded shadow-md max-h-60 overflow-y-auto z-20">
                            {results.map((place, index) => (
                                <li
                                    key={index}
                                    className="flex justify-between items-center p-2 hover:bg-background-beige2 cursor-pointer"
                                >
                                    <span>{place.name}</span>
                                    <button
                                        className="ml-2 px-2 py-1 text-sm bg-primary-brown text-white rounded hover:bg-opacity-80"
                                        onMouseDown={() => handleAddPlace(place)}
                                    >
                                        Add
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <button
                onClick={handleLogout}
                className="hover:underline hover:cursor-pointer"
            >
                <p className="text-primary-brown text-heading-3">Sign Out</p>
            </button>

        </div>
    );
}

export default Head;
