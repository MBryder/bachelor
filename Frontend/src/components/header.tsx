import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { fetchSearchResults, fetchPlaceById } from '../services/placesService';
import { place } from "../utils/types"
import { useInList } from "../helper/inList";
import { useAddToList, useRemoveFromList } from '../helper/updateList';


function Head(){
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const debounceTimeout = useRef<number | null>(null);
    const [results, setResults] = useState<place[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const addToList = useAddToList();
    const removeFromList = useRemoveFromList();
    const inList = useInList()


    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/login');
    };

    const handleAddPlace = async (place: place) => {
        const resultPlace = await fetchPlaceById(place.placeId);
        console.log(resultPlace);
      
        if (!resultPlace) {
          console.error("Place could not be fetched.");
          return;
        }
      
        addToList(resultPlace);
        
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
            <div className="flex border-1 border-primary-brown w-1/3 rounded-4xl bg-background-beige1 shadow-lg items-center relative">
                <button
                    onClick={() => navigate('/home')}
                    className="hover:underline hover:cursor-pointer flex-1/6 border-r-1 py-2 px-4 border-primary-brown"
                >
                    <p className="text-primary-brown text-heading-3">Map</p>
                </button>
                <button
                    onClick={() => navigate('/profile')}
                    className="hover:underline hover:cursor-pointer flex-1/5 border-r-1 py-2 px-4 border-primary-brown"
                >
                    <p className="text-primary-brown text-heading-3">My profile</p>
                </button>
                <button
                    onClick={() => navigate('/about')}
                    className="hover:underline hover:cursor-pointer flex-1/5 border-x-1 py-2 px-4 border-primary-brown"
                >
                    <p className="text-primary-brown text-heading-3">About</p>
                </button>

                {/* Search Input */}
                <div className="relative flex-2/5">
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
                                    {inList(place.placeId) ? (
                                        <button
                                            className="ml-2 px-2 py-1 text-sm bg-primary-brown text-white rounded hover:bg-opacity-80"
                                            onClick={() => removeFromList(place.placeId)}
                                        >
                                            Remove
                                        </button>
                                    ) : (
                                        <button
                                            className="ml-2 px-2 py-1 text-sm bg-primary-brown text-white rounded hover:bg-opacity-80"
                                            onClick={() => handleAddPlace(place)}
                                        >
                                            Add
                                        </button>
                                    )}
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
