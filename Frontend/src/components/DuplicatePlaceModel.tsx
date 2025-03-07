import React from "react";

interface DuplicatePlaceModalProps {
    showModal: boolean;
    handleCancelAddPlace: () => void;
    handleConfirmAddPlace: () => void;
}

const DuplicatePlaceModal: React.FC<DuplicatePlaceModalProps> = ({
    showModal,
    handleCancelAddPlace,
    handleConfirmAddPlace,
}) => {
    if (!showModal) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded shadow-lg">
                <h2 className="text-xl font-bold mb-4">Duplicate Place</h2>
                <p>Do you want to add this place twice?</p>
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={handleCancelAddPlace}
                        className="mr-2 p-2 bg-gray-500 text-white rounded"
                    >
                        No
                    </button>
                    <button
                        onClick={handleConfirmAddPlace}
                        className="p-2 bg-blue-500 text-white rounded"
                    >
                        Yes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DuplicatePlaceModal;