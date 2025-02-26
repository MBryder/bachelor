import { useEffect, useState } from "react";
import React from "react";

import Head from "../components/Head";

function Home() {
    return (
        <div className="bg-background-beige1 h-screen text-text-dark p-8">
            <Head />
            <h1 className="text-display-1 font-display">Display 1</h1>
            <h2 className="text-heading-1">Heading 1</h2>
            <h3 className="text-heading-2">Heading 2</h3>
            <h4 className="text-heading-3">Heading 3</h4>
            <p className="text-paragraph-1">This is a paragraph with paragraph-1 style.</p>
            <button className="bg-primary-dark text-white px-4 py-2 text-button rounded-lg shadow-custom1">
                Click Me
            </button>
        </div>
    );
}
export default Home;