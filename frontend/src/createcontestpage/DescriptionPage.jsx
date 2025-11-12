import React from "react";

const DescriptionPage = ({ setActiveTab }) => {
    const organizers = [
        { uesrId: `user1`, userName: `User 1` },
        { uesrId: `user2`, userName: `User 2` },
        { uesrId: `user3`, userName: `User 3` },
        { uesrId: `user4`, userName: `User 4` },
        { uesrId: `user5`, userName: `User 5` }
    ]
    return (
        <>
            <div className="flex justify-center items-start min-h-screen  pb-10">
                <div className="lg:w-1/2 md:w-full bg-white p-6 space-y-2">
                    <div className="flex flex-col">
                        <label className="font-medium mb-1">Contest Name</label>
                        <input
                            type="text"
                            placeholder="Contest Name"
                            className="py-2 px-3 ring-2 ring-gray-200 rounded-md w-full"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-medium mb-1">Contest Id</label>
                        <input
                            type="text"
                            placeholder="Contest Id"
                            className="py-2 px-3 ring-2 ring-gray-200 rounded-md w-full"
                        />
                    </div>

                    <div className="flex flex-col my-2">
                        <label className="font-medium mb-1">Organizers</label>
                        {
                            organizers.map((item, index) => (
                                <div key={index} className="flex items-center justify-around">
                                    <p>{item.userName}</p>
                                    <p>X</p>
                                </div>
                            ))
                        }
                        <div className="flex my-2">
                            <label className="font-medium mb-1">Add Organizers</label>
                            <input
                                type="text"
                                placeholder="user ID or username"
                                className="py-2 px-3 ring-2 ring-gray-200 rounded-md mx-2"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="font-medium mb-1">Start Date & Time</label>
                        <input
                            type="text"
                            placeholder="Date"
                            className="py-2 px-3 ring-2 ring-gray-200 rounded-md my-1"
                        />
                        <input
                            type="text"
                            placeholder="Time"
                            className="py-2 px-3 ring-2 ring-gray-200 rounded-md my-1"
                        />
                    </div>


                    <div className="flex items-center gap-2">
                        <label className="font-medium mb-1">End Date & Time</label>
                        <input
                            type="text"
                            placeholder="Date"
                            className="py-2 px-3 ring-2 ring-gray-200 rounded-md my-1"
                        />
                        <input
                            type="text"
                            placeholder="Time"
                            className="py-2 px-3 ring-2 ring-gray-200 rounded-md my-1"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-medium mb-1">Difficulty</label>
                        <select
                            name="difficulty"
                            className="py-2 px-3 ring-2 ring-gray-200 rounded-md w-full"
                        >
                            <option value="div1">Div 1</option>
                            <option value="div2">Div 2</option>
                            <option value="div3">Div 3</option>
                        </select>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4">
                        <button className="py-2 px-4 border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 transition cursor-pointer">
                            Save Changes
                        </button>
                        <button className="py-2 px-4 bg-green-500 text-white text-lg rounded-md shadow hover:bg-green-600 transition cursor-pointer" onClick={() => setActiveTab('problems')}>
                            Next
                        </button>
                    </div>
                </div>
            </div>

        </>
    );
};

export default DescriptionPage;
