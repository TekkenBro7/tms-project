import React, { useState } from 'react';
import { XIcon, UserCircleIcon } from '@heroicons/react/outline';

const SubtaskModal = ({ subtask, currentUser, onClose, onSave }) => {
    const now = new Date();
    now.setHours(now.getHours() + 3);
    const today = now.toISOString().split('T')[0];
    
    const isDeadlineOverdue = subtask.deadline && new Date(subtask.deadline) < now;
    
    const [formData, setFormData] = useState({
        title: subtask.title,
        status: subtask.status,
        deadline: subtask.deadline ? subtask.deadline.split('T')[0] : '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const canEdit = subtask.assignee === currentUser.id || currentUser.is_superuser;

    const getMinDate = () => {
        if (!subtask.deadline) return today; 
        if (isDeadlineOverdue) return subtask.deadline.split('T')[0];
        return today; 
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Edit Subtask</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <XIcon className="h-5 w-5" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            required
                            disabled={!canEdit}
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
                        <div className="flex items-center">
                            <UserCircleIcon className="h-5 w-5 text-gray-400 mr-2" />
                            <span className="text-sm">
                                {subtask.assignee_name || 'Unassigned'}
                            </span>
                        </div>
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            disabled={!canEdit}
                        >
                            <option value="todo">To Do</option>
                            <option value="in_progress">In Progress</option>
                            <option value="in_review">In Review</option>
                            <option value="in_qa">In QA</option>
                            <option value="rejected">Rejected</option>
                            <option value="canceled">Canceled</option>
                            <option value="done">Done</option>
                        </select>
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                        <input
                            type="date"
                            name="deadline"
                            value={formData.deadline}
                            onChange={handleChange}
                            min={getMinDate()}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            disabled={!canEdit}
                        />
                    </div>
                    
                    {canEdit ? (
                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-6 py-2 rounded shadow-lg hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 flex items-center"
                            >
                                Save Changes
                            </button>
                        </div>
                    ) : (
                        <div className="text-sm text-gray-500">
                            Only the assignee can edit this subtask
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default SubtaskModal;
