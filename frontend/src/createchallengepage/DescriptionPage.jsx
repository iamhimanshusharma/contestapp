import React from "react";
import ContentContainer from "./ContentContainer";

const DescriptionPage = () => {
    return (
        <div className="flex justify-center items-start min-h-screen  pb-10">
            <div className="lg:w-1/2 md:w-full bg-white p-6 space-y-2">
                <div className="flex flex-col">
                    <label className="font-medium mb-1">Title</label>
                    <input
                        type="text"
                        placeholder="Title"
                        className="py-2 px-3 ring-2 ring-gray-200 rounded-md w-full"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="font-medium mb-1">Difficulty</label>
                    <select
                        name="difficulty"
                        className="py-2 px-3 ring-2 ring-gray-200 rounded-md w-full"
                    >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                </div>
                <div>
                    <span className="font-medium">Description</span>
                    <ContentContainer elementKey="description" />
                </div>
                <div>
                    <label className="font-medium">Input</label>
                    <ContentContainer elementKey="input" />
                </div>
                <div>
                    <label className="font-medium">Output</label>
                    <ContentContainer elementKey="output" />
                </div>
                <div>
                    <label className="font-medium">Constraints</label>
                    <ContentContainer elementKey="constraint" />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4">
                    <button className="py-2 px-4 border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 transition">
                        Save Changes
                    </button>
                    <button className="py-2 px-4 bg-green-500 text-white text-lg rounded-md shadow hover:bg-green-600 transition">
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DescriptionPage;
