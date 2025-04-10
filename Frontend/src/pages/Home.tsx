import { useEffect, useState } from "react";
import Head from "../components/header";
import Map from "../components/map";

function Home() {
    const [visiblePlaces, setVisiblePlaces] = useState<any[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

    useEffect(() => {
        // Check login status on mount
        const user = localStorage.getItem('username');
        setIsLoggedIn(!!user);
    }, []);

    if (isLoggedIn === null) {
        return <div>Loading...</div>; // while checking login
    }

    if (!isLoggedIn) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-red-100 text-red-800">
                <h1 className="text-2xl mb-4">Access Denied: You must be logged in to view this page.</h1>
                <a href="http://localhost:5173/login" className="text-blue-500 underline">Click here to log in!</a>
                <a href="http://localhost:5173/signup" className="text-blue-500 underline">If you don't have an account, you can sign up here!</a>
            </div>
        );
    }

    return (
        <div className="bg-background-beige1 h-screen text-text-dark flex-row">
            <Head />
            <div className="flex h-[calc(100%-60px)]">
                <Map setVisiblePlaces={setVisiblePlaces} visiblePlaces={visiblePlaces} />
            </div>
        </div>
    );
}

export default Home;
