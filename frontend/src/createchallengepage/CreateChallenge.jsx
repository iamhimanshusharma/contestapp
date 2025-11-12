import React, { useState } from 'react'
import DescriptionPage from '../createchallengepage/DescriptionPage';
import Header from '../Header';
import CreateTestCase from './CreateTestCases';
import StubsPage from './StubsPage';

const CreateChallenge = () => {
    const [activeTab, setActiveTab] = useState("details");

    const tabs = [
        { id: "details", title: "Details" },
        { id: "testcases", title: "Testcases" },
        { id: "stubs", title: "Stubs" }
    ]

    function tabContentRender() {
        switch (activeTab) {
            case "details":
                return <DescriptionPage setActiveTab={setActiveTab} />
            case "testcases":
                return <CreateTestCase setActiveTab={setActiveTab} />
            case "stubs":
                return <StubsPage setActiveTab={setActiveTab} />
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

export default CreateChallenge