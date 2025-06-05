import React from 'react';
import { PlusIcon } from '@heroicons/react/outline';

const SubtaskForm = ({
    formData,
    editId,
    statusOptions,
    creationStatusOptions,
    tasks,
    users,
    handleInput,
    handleDateChange,
    handleSubmit,
    onCancel,
    error
}) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
            {editId ? 'Edit Subtask' : 'Create New Subtask'}
        </h2>
        {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
            </div>
        )}
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
                </label>
                <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInput}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                name="status"
                value={formData.status}
                onChange={handleInput}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                disabled={!editId}
                >
                {editId ? (
                    statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                    ))
                ) : (
                    creationStatusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                    ))
                )}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task *</label>
                <select
                name="task"
                value={formData.task}
                onChange={handleInput}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                disabled={!!editId}
                >
                <option value="">Select task</option>
                {tasks.map((task) => (
                    <option key={task.id} value={task.id}>
                    {task.title} (ID: {task.id})
                    </option>
                ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
                <select
                name="assignee"
                value={formData.assignee}
                onChange={handleInput}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                <option value="">Select assignee</option>
                {users.map((user) => (
                    <option key={user.id} value={user.id}>
                    {user.username || user.email}
                    </option>
                ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleDateChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>
            </div>
            <div className="mt-4 flex justify-end space-x-4">
            <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
                Cancel
            </button>
            <button
                type="submit"
                className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-6 py-2 rounded shadow-lg hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 flex items-center"
            >
                <PlusIcon className="h-5 w-5 mr-2" />
                {editId ? 'Save Changes' : 'Create Subtask'}
            </button>
            </div>
        </form>
        </div>
    );
};

export default SubtaskForm;
