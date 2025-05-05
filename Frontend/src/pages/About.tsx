import React from 'react';
import ProfileHeader from '../components/ProfileHeader';

const About: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen bg-background-beige1 text-text-dark">
            <ProfileHeader />
            <div className="flex-grow flex items-center justify-center py-10">
                <div className="bg-white shadow-lg p-6 rounded-xl w-full max-w-4xl">
                    <h1 className="text-display-1 border-b pb-2 mb-6">About</h1>

                    <div className="mb-6 text-paragraph-0.5 space-y-5">
                        <p>
                            <strong>NextStop</strong> is a website developed to help tourists discover the fastest route between the best attractions in Copenhagen.
                        
                            
                        </p>

                        <p>
                            With a clean, intuitive interface, users can save their favorite paths, revisit past adventures,
                            and explore Copenhagen, whether during the visit or in preparation for the visit at home.
                        </p>

                        <p>
                        Our dream is that you, when you come back home, will feel that you made the most out of your visit to our beautiful city with the limited time that you had 😌
                        </p>
                        <div className="pt-6">
                            <h2 className="text-xl font-semibold mb-2">Helpful Resources for Visiting Copenhagen</h2>
                            <ul className="list-disc pl-6 space-y-1 text-blue-700 underline">
                                <li><a href="https://www.visitcopenhagen.com" target="_blank" rel="noopener noreferrer">Visit Copenhagen (Official City Guide)</a></li>
                                <li><a href="https://www.visitdenmark.com/denmark/destinations/copenhagen" target="_blank" rel="noopener noreferrer">Visit Denmark – Copenhagen Section</a></li>
                                <li><a href="https://www.wonderfulcopenhagen.com" target="_blank" rel="noopener noreferrer">Wonderful Copenhagen (Capital Region Tourism)</a></li>
                                <li><a href="https://www.tripadvisor.com/Tourism-g189541-Copenhagen_Zealand-Vacations.html" target="_blank" rel="noopener noreferrer">Tripadvisor – Copenhagen Travel Reviews</a></li>
                                <li><a href="https://www.lonelyplanet.com/destinations/denmark/copenhagen" target="_blank" rel="noopener noreferrer">Lonely Planet – Copenhagen Travel Guide</a></li>
                                <li><a href="https://copenhagencard.com" target="_blank" rel="noopener noreferrer">Copenhagen Card – Attractions & Transport Pass</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t pt-4 text-sm text-gray-600">
                    </div>

                    <div className="border-t pt-4 text-sm text-gray-600">
                        <p>Version 1.0.0</p>
                        <p>Developed as a bachelors project, 2025</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;