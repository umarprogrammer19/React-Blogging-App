// Modal.js
import React from 'react';

const Modal = ({ isOpen, onClose, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                <h2 className="text-lg font-bold mb-4">Notification!</h2>
                <p>{message}</p>
                <button
                    className="bg-purple-500 text-white px-5 py-2 rounded mt-4 hover:bg-black"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default Modal;
