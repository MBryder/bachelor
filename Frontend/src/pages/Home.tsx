import { useState } from "react";
import Head from "../components/header";
import Map from "../components/map";

function Home() {
    const [visiblePlaces, setVisiblePlaces] = useState<any[]>([]);

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
