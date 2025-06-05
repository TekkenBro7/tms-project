import React from 'react';
import { PlusIcon } from '@heroicons/react/outline';

const ProjectForm = ({
    formData,
    editId,
    users,
    handleInput,
    handleSubmit,
    setFormData
}) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">
                {editId ? "Edit Project" : "Create New Project"}
            </h2>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Project Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInput}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Owner *</label>
                        <select
                            name="owner"
                            value={formData.owner}
                            onChange={handleInput}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">Select owner</option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.username || user.email}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Members</label>
                        <select
                            name="members"
                            multiple
                            value={formData.members}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    members: Array.from(e.target.selectedOptions, (option) => option.value),
                                }))
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.username || user.email}
                                </option>
                            ))}
                        </select>
                        <p className="text-sm text-gray-400 mt-1">Use Ctrl/Command for multiple selection</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInput}
                            className="w-full h-24 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                        />
                    </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="is_active"
                            name="is_active"
                            checked={formData.is_active}
                            onChange={handleInput}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                            Active project
                        </label>
                    </div>
                    <button
                        type="submit"
                        className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-10 py-2 rounded shadow-lg hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 flex items-center"
                    >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        {editId ? "Save Changes" : "Create Project"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProjectForm;
