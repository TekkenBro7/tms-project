import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactDOM from 'react-dom';
import { XIcon, UserCircleIcon, CheckCircleIcon } from '@heroicons/react/outline';

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
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const canEdit = subtask.assignee === currentUser.id || currentUser.is_superuser;

    const getMinDate = () => {
        if (!subtask.deadline) return today;
        return isDeadlineOverdue ? subtask.deadline.split('T')[0] : today;
    };

    return ReactDOM.createPortal(
        <AnimatePresence>
            <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
                onClick={onClose}
            >
                <motion.div
                    key="modal"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-800">
                            {canEdit ? 'Edit Subtask' : 'View Subtask'}
                        </h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <XIcon className="h-6 w-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                disabled={!canEdit}
                                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                                required
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">Assignee</label>
                            <div className="flex items-center mt-1 text-sm text-gray-600">
                                <UserCircleIcon className="h-5 w-5 mr-2 text-gray-400" />
                                {subtask.assignee_name || 'Unassigned'}
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                disabled={!canEdit}
                                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
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

                        <div>
                            <label className="text-sm font-medium text-gray-700">Deadline</label>
                            <input
                                type="date"
                                name="deadline"
                                value={formData.deadline}
                                onChange={handleChange}
                                min={getMinDate()}
                                disabled={!canEdit}
                                className={`w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                                    isDeadlineOverdue ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                }`}
                            />
                            {isDeadlineOverdue && (
                                <p className="mt-1 text-xs text-red-600">This deadline has passed</p>
                            )}
                        </div>

                        <div className="flex justify-end pt-4 space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            {canEdit && (
                                <button
                                    type="submit"
                                    className="flex items-center justify-center px-6 py-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-lg shadow-lg hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                                    Save
                                </button>
                            )}
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>,
        document.getElementById('modal-root')
    );
};

export default SubtaskModal;
