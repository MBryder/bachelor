import Head from "../components/header";
import Map from "../components/map";
import image from "../assets/Jens.jpg";

function Test() {
    

    return (
        <div className="bg-background-beige1 h-screen text-text-dark flex-row">
            <Head />
            <div className="flex h-[calc(100%-60px)]">
                <div className="w-4/8 overflow-y-auto p-4  scrollbar">
                    <div className="flex flex-wrap ">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((item) => (
                        <div key={item} className=" w-1/3 min-w-[200px] flex flex-col p-2 ">
                            <div className="aspect-square w-full flex justify-center items-center">
                                <img
                                    src={image} 
                                    alt={`Item ${item}`}
                                    className="size-full object-cover rounded-2xl" 
                                />
                            </div>

                            <div className=" pt-2">
                                <h4 className="text-heading-3">Title {item}</h4>
                                <p className="text-paragraph-2">Description of Item {item}</p>
                                <p className="text-paragraph-2">Description of Item {item}</p>
                                <p className="text-paragraph-2">Description of Item {item}</p>
                                <h4 className="text-heading-3 pt-1">Description of Item {item}</h4>
                        
                            </div>
                            
                        </div>
                        ))}
                    </div>
                </div> 
                <div className="w-auto h-full flex-grow">
                    <div className="h-full flex justify-center items-center">
                        <div className="w-full h-full">
                            <Map />
                        </div>
                    </div>
                </div>

                
            </div>
        </div>

    );
};

export default Test;