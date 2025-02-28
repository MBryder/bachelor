import Head from "../components/header";
import Map from "../components/map";
import image from "../assets/Jens.jpg";

function Home() {
    

    return (
        <div className="bg-background-beige1 h-screen text-text-dark px-8 flex-row">
            <Head />
            <div className="h-[70px] border-b-2 border-primary-brown flex items-center justify-between px-8">
                <div className="flex items-center space-x-4 h-[50px]">
                    <button className="border-2 border-primary-brown bg-background-beige2 shadow-custom1 rounded-xl h-full w-[110px]">
                        <p className=" text-primary-brown text-heading-4 ">Filter</p>
                    </button>
                </div>
            </div>
            <div className="flex h-[calc(100%-150px)]"> 
                <div className="w-2/3 border-r border-gray-300">
                    <div className="h-full flex justify-center items-center">
                        <div className="w-full h-full border border-gray-300">
                            <Map />
                        </div>
                    </div>
                </div>

                <div className="w-1/3 overflow-y-auto p-4 h-full scrollbar">
                <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((item) => (
                    <div key={item} className="bg-gray-200 border h-72 border-gray-300 p-4 flex flex-col justify-between">
                        <div className="h-2/3 bg-gray-300 flex justify-center items-center">
                            <img
                                src={image} 
                                alt={`Item ${item}`}
                                className="size-full object-cover" 
                            />
                        </div>

                        <hr className="my-2 border-gray-400" />

                        <div className="text-center">
                        <p className="text-sm">Description of Item {item}</p>
                        </div>
                        
                    </div>
                    ))}
                </div>
                </div>
            </div>
        </div>

    );
};

export default Home;