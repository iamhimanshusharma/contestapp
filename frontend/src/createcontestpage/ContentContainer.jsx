import React, { useState } from 'react'
import MarkdownPreview from '@uiw/react-markdown-preview';

const ContentContainer = ({ elementKey }) => {
    const [getContent, setContent] = useState("")
    const [showPreview, setShowPreview] = useState(false);

    function onClickHandler() {
        setShowPreview(true)
        const getCon = document.getElementById(elementKey).value;
        setContent(getCon)
    }

    return (
        <>
            <div className="p-4 rounded-md w-fit flex" key={elementKey}>
                <div>
                    <div className="bg-gray-200 py-2 flex items-center">
                        <button className="border border-gray-500 rounded-md py-1 px-3 bg-white ml-3" onClick={onClickHandler}>
                            Preview
                        </button>
                    </div>

                    <div className="">
                        <textarea
                            cols="100"
                            rows="5"
                            className="ring-2 ring-gray-200 w-full rounded-md p-2"
                            id={elementKey}
                        ></textarea>
                    </div>
                </div>
            </div>

            {showPreview && (
                <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-3/4 h-3/4 p-6 relative overflow-auto">
                        {/* Close button */}
                        <button
                            onClick={() => setShowPreview(false)}
                            className="absolute top-4 right-4 text-gray-600 hover:text-black text-xl font-bold"
                        >
                            ×
                        </button>

                        <MarkdownPreview source={getContent} wrapperElement={{
                            "data-color-mode": "light"
                        }} />
                    </div>
                </div>
            )}

        </>
    )
}

export default ContentContainer