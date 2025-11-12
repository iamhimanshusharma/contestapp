import React, { useState } from 'react'
import { Pencil } from 'lucide-react'

const CreateTestCases = ({ setActiveTab }) => {
    const [testcases, setTestcases] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({ input: '', expected: '', sample: false })
    const [editIndex, setEditIndex] = useState(null)

    const handleAddClick = () => {
        setFormData({ input: '', expected: '', sample: false })
        setEditIndex(null)
        setShowForm(true)
    }

    const handleSubmit = () => {
        if (editIndex !== null) {

            const updated = [...testcases]
            updated[editIndex] = formData
            setTestcases(updated)
        } else {

            setTestcases([...testcases, formData])
        }
        setShowForm(false)
        setFormData({ input: '', expected: '', sample: false })
        setEditIndex(null)
    }

    const handleEdit = (index) => {
        setFormData(testcases[index])
        setEditIndex(index)
        setShowForm(true)
    }

    return (
        <>
            <div className="flex justify-center items-start pb-10">
                <div className="lg:w-1/2 md:w-full bg-white space-y-2">
                    <div className="p-8">
                        <button
                            onClick={handleAddClick}
                            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                        >
                            + Add Testcase
                        </button>

                        <div className="mt-6 space-y-4">
                            {testcases.length === 0 && (
                                <p className="text-gray-500">No testcases added yet.</p>
                            )}

                            {testcases.map((tc, index) => (
                                <div
                                    key={index}
                                    className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
                                >
                                    <div>
                                        <p><span className="font-semibold">Input:</span> {tc.input}</p>
                                        <p><span className="font-semibold">Expected:</span> {tc.expected}</p>
                                        <p>
                                            <span className="font-semibold">Sample:</span>{' '}
                                            {tc.sample ? '✅ Yes' : '❌ No'}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleEdit(index)}
                                        className="text-gray-500 hover:text-blue-600"
                                        title="Edit Testcase"
                                    >
                                        <Pencil size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {showForm && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
                                <div className="bg-white rounded-xl shadow-lg w-[400px] p-6">
                                    <h2 className="text-xl font-semibold mb-4">
                                        {editIndex !== null ? 'Update Testcase' : 'Add Testcase'}
                                    </h2>

                                    <div className="flex flex-col space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium">Input</label>
                                            <textarea
                                                className="w-full border rounded-md px-3 py-2 mt-1 ring-1 ring-gray-300 focus:ring-blue-500 focus:outline-none"
                                                rows={2}
                                                value={formData.input}
                                                onChange={(e) => setFormData({ ...formData, input: e.target.value })}
                                            ></textarea>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium">Expected Output</label>
                                            <textarea
                                                className="w-full border rounded-md px-3 py-2 mt-1 ring-1 ring-gray-300 focus:ring-blue-500 focus:outline-none"
                                                rows={2}
                                                value={formData.expected}
                                                onChange={(e) => setFormData({ ...formData, expected: e.target.value })}
                                            ></textarea>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={formData.sample}
                                                onChange={(e) => setFormData({ ...formData, sample: e.target.checked })}
                                                className="w-4 h-4"
                                            />
                                            <label>Sample Testcase</label>
                                        </div>
                                    </div>

                                    <div className="flex justify-end mt-6 space-x-3">
                                        <button
                                            onClick={() => setShowForm(false)}
                                            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSubmit}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                        >
                                            {editIndex !== null ? 'Update' : 'Add'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center justify-end gap-3 pt-4">
                        <button className="py-2 px-4 border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 transition">
                            Save Changes
                        </button>
                        <button className="py-2 px-4 bg-green-500 text-white text-lg rounded-md shadow hover:bg-green-600 transition" onClick={() => setActiveTab("stubs")}>
                            Next
                        </button>
                    </div>
                </div>
            </div >
        </>
    )
}

export default CreateTestCases
