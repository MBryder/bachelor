import { useState } from "react";

function Filter({
    filterTypes,
    setFilterTypes,
}: {
    filterTypes: string[];
    setFilterTypes: (types: string[]) => void;
}) {
    const toggleFilter = (type: string) => {
        if (filterTypes.includes(type)) {
            setFilterTypes(filterTypes.filter(t => t !== type));
        } else {
            setFilterTypes([...filterTypes, type]);
        }
    };

    const filters = [
        { label: "Bars", value: "bar" },
        { label: "Restaurants", value: "restaurant" },
        { label: "Lodgings", value: "lodging" },
        { label: "Establishments", value: "establishment" },
        { label: "Cafe's", value: "cafe" },
    ];

    return (
        <div className="z-50 flex flex-row items-end pt-4 pb-4 gap-2">
            <button
                className={`px-4 rounded-full shadow-md border text-heading-4 ${
                    filterTypes.length === 0
                        ? "bg-primary-brown text-white border-primary-brown"
                        : "bg-background-beige2 text-primary-brown border-primary-brown hover:bg-background-beige1"
                }`}
                onClick={() => setFilterTypes([])}
            >
                Show All
            </button>
            {filters.map(({ label, value }) => (
                <button
                    key={value}
                    className={`px-4 rounded-full shadow-md border text-heading-4 ${
                        filterTypes.includes(value)
                            ? "bg-primary-brown text-white border-primary-brown"
                            : "bg-background-beige2 text-primary-brown border-primary-brown hover:bg-background-beige1"
                    }`}
                    onClick={() => toggleFilter(value)}
                >
                    {label}
                </button>
            ))}
        </div>
    );
}

export default Filter;
