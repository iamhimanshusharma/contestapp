import React, { useState } from 'react'
import DescriptionPage from '../createchallengepage/DescriptionPage';
import Header from '../Header';
import CreateTestCase from './CreateTestCases';

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
                return <DescriptionPage />
            case "testcases":
                return <CreateTestCase />
            case "stubs":
                return <p>Stubs will be here.</p>
            default:
                return;
        }
    }

    return (
        <>
            <Header />
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

export default CreateChallenge