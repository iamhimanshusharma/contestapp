import React from 'react'
import { Editor } from "@monaco-editor/react";


const StubsPage = () => {
    return (
        <>
            <div className="flex justify-center items-start min-h-screen  pb-10">
                <div className="lg:w-1/2 md:w-full bg-white p-6 space-y-2">
                    <div>
                        <select name="" id="" className='py-2 px-3 ring-2 ring-gray-200 rounded-md w-full'>
                            <option value="cpp">C++</option>
                            <option value="c">C</option>
                            <option value="java">Java</option>
                            <option value="python">Python</option>
                        </select>
                    </div>
                    <div className="flex-1 overflow-hidden h-60 ring-1 rounded-md">
                        <p className='py-2 px-4 text-sm font-bold'>Head</p>
                        <Editor
                            language={`cpp`}
                            value={`//head here`}
                            height="100%"
                        />
                    </div>
                    <div className="flex-1 overflow-hidden h-60 ring-1 rounded-md">
                        <p className='py-2 px-4 text-sm font-bold'>Body</p>
                        <Editor
                            language={`cpp`}
                            value={`//body here`}
                            height="100%"
                        />
                    </div>
                    <div className="flex-1 overflow-hidden h-60 ring-1 rounded-md">
                        <p className='py-2 px-4 text-sm font-bold'>Tail</p>
                        <Editor
                            language={`cpp`}
                            value={`//tail here`}
                            height="100%"
                        />
                    </div>
                    <div className="flex items-center justify-end gap-3 pt-4">
                        <button className="py-2 px-4 border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 transition">
                            Save Changes
                        </button>
                        <button className="py-2 px-4 bg-green-500 text-white text-lg rounded-md shadow hover:bg-green-600 transition" onClick={() => setActiveTab("stubs")}>
                            Create
                        </button>
                    </div>
                </div>
            </div>

        </>
    )
}

export default StubsPage