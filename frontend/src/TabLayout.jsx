import React, { useState } from "react";

const TabLayout = () => {
    const [activeTab, setActiveTab] = useState("home");

    const tabs = [
        { id: "home", label: "Home" },
        { id: "profile", label: "Profile" },
        { id: "settings", label: "Settings" },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case "home":
                return <p className="text-gray-700">Welcome to the Home tab!</p>;
            case "profile":
                return <p className="text-gray-700">Here’s your Profile info.</p>;
            case "settings":
                return <p className="text-gray-700">Adjust your Settings here.</p>;
            default:
                return null;
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto mt-10">
            {/* Tabs */}
            <div className="flex border-b border-gray-300">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative flex-1 py-2 text-center font-medium transition-all duration-300 
              ${activeTab === tab.id
                                ? "text-blue-600"
                                : "text-gray-500 hover:text-blue-500"
                            }`}
                    >
                        {tab.label}
                        {activeTab === tab.id && (
                            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-600 rounded-t-md transition-all duration-300"></span>
                        )}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="p-6 bg-white rounded-b-xl shadow mt-2">{renderContent()}</div>
        </div>
    );
};

export default TabLayout;
