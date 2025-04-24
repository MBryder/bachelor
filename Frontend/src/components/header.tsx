import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import { fetchSearchResults } from '../services/mapService';


function Head() {
    

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/login');
    }

    const navigate = useNavigate();  
    const [Search, setSearch] = useState('');
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (Search === '') return;

        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = setTimeout(async () => {
            const results = await fetchSearchResults(Search);
            console.log(results);
        }, 400); // adjust delay as needed (400ms is typical)

        return () => {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
        };
    }, [Search]);
    


    return (
        <div className="h-[60px] border-b border-primary-brown flex items-center justify-between px-8">
            <div>
                <h1 className="text-display-1 font-display text-primary-brown">NextStop</h1>
            </div>
            <div className='flex border-1 border-primary-brown rounded-4xl bg-background-beige1 shadow-lg items-center'>
                <button
                    onClick={handleLogout}
                    className="hover:underline hover:cursor-pointer border-r-1 py-2 px-4 border-primary-brown "
                >
                    <p className="text-primary-brown text-heading-3">My routes</p>
                </button>
                <button
                    onClick={handleLogout}
                    className="hover:underline hover:cursor-pointer border-x-1 py-2 px-4 border-primary-brown"
                >
                    <p className="text-primary-brown text-heading-3">My routes</p>
                </button>
                <input
                    type="text"
                    value={Search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search"
                    className="hover:cursor-pointer border-l-1 py-2 px-4 border-primary-brown text-primary-brown text-heading-3"
                >
                </input>
            </div>
            <div>
                <button
                    onClick={handleLogout}
                    className="hover:underline hover:cursor-pointer"
                >
                    <p className="text-primary-brown text-heading-3">Sign Out</p>
                </button>
            </div>            
        </div>
    );
}

export default Head;