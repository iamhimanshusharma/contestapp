import React, { useState } from 'react'
import Header from '../Header';
import DescriptionPage from './DescriptionPage';
import SelectProblems from './SelectProblems';

const CreateContest = () => {
    const [activeTab, setActiveTab] = useState("details");

    const tabs = [
        { id: "details", title: "Details" },
        { id: "problems", title: "Problems" }
    ]

    function tabContentRender() {
        switch (activeTab) {
            case "details":
                return <DescriptionPage setActiveTab={setActiveTab} />
            case "problems":
                return <SelectProblems setActiveTab={setActiveTab} />
            default:
                return;
        }
    }

    return (
        <>
            <Header />
            <div className='m-4 flex justify-center'>
                {
                    tabs.map((tab, index) => (
                        <button key={index} className={`cursor-pointer my-2 shadow ring-gray-100 px-10 py-1 text-xl ${tab.id == activeTab ? `border-b-2 border-green-500 text-green-500` : null}`} onClick={() => setActiveTab(tab.id)}>
                            {tab.title}
                        </button>
                    ))
                }
            </div>
            <div>{tabContentRender()}
            </div>
        </>
    )
}

export default CreateContest