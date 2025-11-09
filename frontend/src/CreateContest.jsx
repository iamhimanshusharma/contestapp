import React, { useState } from 'react'
import DescriptionPage from './createcontestpage/DescriptionPage';

const CreateContest = () => {
    const [activeTab, setActiveTab] = useState("details");

    const tabs = [
        { id: "details", title: "Details" },
        { id: "testcases", title: "Testcases" },
        { id: "stubs", title: "Stubs" }
    ]

    function tabContentRender() {
        switch (activeTab) {
            case "details":
                return <DescriptionPage />
            case "testcases":
                return <p>Testcases will be here.</p>
            case "stubs":
                return <p>Stubs will be here.</p>
            default:
                return;
        }
    }

    return (
        <>
            <div className='m-4'>
                {
                    tabs.map((tab, index) => (
                        <button className={`cursor-pointer my-2 shadow ring-gray-100 px-3 py-1 ${tab.id == activeTab ? `border-b-2` : null}`} onClick={() => setActiveTab(tab.id)}>
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