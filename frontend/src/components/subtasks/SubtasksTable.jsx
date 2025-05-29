import React from 'react';
import { PencilIcon, TrashIcon, ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/outline';

const SubtasksTable = ({
    subtasks,
    expandedRows,
    subtaskDetails,
    loading,
    statusOptions,
    toggleRow,
    handleEdit,
    handleDelete,
    editId,
    getTaskTitle,
    getUserName
}) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {subtasks.length > 0 ? (
                subtasks.map((subtask) => (
                    <React.Fragment key={subtask.id}>
                    <tr 
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => toggleRow(subtask.id)}
                    >
                        <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                            {expandedRows.includes(subtask.id) ? (
                            <ChevronDownIcon className="h-5 w-5 mr-2 text-gray-400" />
                            ) : (
                            <ChevronRightIcon className="h-5 w-5 mr-2 text-gray-400" />
                            )}
                            <div>
                            <div className="text-sm font-medium text-gray-900">{subtask.title}</div>
                            <div className="text-sm text-gray-500">ID: {subtask.id}</div>
                            </div>
                        </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${subtask.status === 'done' ? 'bg-green-100 text-green-800' : 
                            subtask.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            subtask.status === 'todo' ? 'bg-gray-100 text-gray-800' :
                            'bg-yellow-100 text-yellow-800'}`}>
                            {statusOptions.find(s => s.value === subtask.status)?.label || subtask.status}
                        </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getUserName(subtask.assignee) || 'Unassigned'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {subtask.deadline ? new Date(subtask.deadline).toLocaleDateString() : 'No deadline'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                            onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(subtask);
                            }}
                            className={`${editId === subtask.id ? 'text-green-600 hover:text-green-900' : 'text-indigo-600 hover:text-indigo-900'} mr-4`}
                        >
                            <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                            onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(subtask.id);
                            }}
                            className="text-red-600 hover:text-red-900"
                        >
                            <TrashIcon className="h-5 w-5" />
                        </button>
                        </td>
                    </tr>
                    {expandedRows.includes(subtask.id) && (
                        <tr className="bg-gray-50">
                        <td colSpan="5" className="px-6 py-4">
                            {loading.details ? (
                            <div className="text-center py-4">Loading subtask details...</div>
                            ) : (
                            subtaskDetails[subtask.id] ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-2">Task</h3>
                                    <p className="text-sm text-gray-900">
                                    {getTaskTitle(subtaskDetails[subtask.id].task)}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-2">Created At</h3>
                                    <p className="text-sm text-gray-900">
                                    {new Date(subtaskDetails[subtask.id].created_at).toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-2">Updated At</h3>
                                    <p className="text-sm text-gray-900">
                                    {new Date(subtaskDetails[subtask.id].updated_at).toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-2">Completed At</h3>
                                    <p className="text-sm text-gray-900">
                                    {subtaskDetails[subtask.id].completed_at ? 
                                        new Date(subtaskDetails[subtask.id].completed_at).toLocaleString() : 
                                        'Not completed'}
                                    </p>
                                </div>
                                </div>
                            ) : (
                                <div className="text-center py-4 text-red-500">Failed to load subtask details</div>
                            )
                            )}
                        </td>
                        </tr>
                    )}
                    </React.Fragment>
                ))
                ) : (
                <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    No subtasks found. Create your first subtask.
                    </td>
                </tr>
                )}
            </tbody>
            </table>
        </div>
        </div>
    );
};

export default SubtasksTable;
