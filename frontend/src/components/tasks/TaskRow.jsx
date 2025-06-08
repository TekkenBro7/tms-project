import React from 'react';
import { ChevronDownIcon, ClockIcon, ChevronRightIcon, PencilIcon, TrashIcon } from '@heroicons/react/outline';

const TaskRow = ({
    task,
    expanded,
    editId,
    statusOptions,
    priorityOptions,
    toggleRow,
    handleEdit,
    handleDelete,
    children
}) => {

    const isOverdue = (deadline) => {
        if (!deadline) return false;
        
        const deadlineDate = new Date(deadline);
        const today = new Date();
        
        deadlineDate.setHours(23, 59, 59, 999);
        
        return deadlineDate < today;
    };

    const isTaskOverdue = task.deadline && isOverdue(task.deadline) && task.status !== 'done';
    
    return (
        <>
        <tr 
            className={`hover:bg-gray-50 cursor-pointer ${isTaskOverdue ? 'bg-red-50' : ''}`}
            onClick={() => toggleRow(task.id)}
        >
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    {expanded ? (
                    <ChevronDownIcon className="h-5 w-5 mr-2 text-gray-400" />
                    ) : (
                    <ChevronRightIcon className="h-5 w-5 mr-2 text-gray-400" />
                    )}
                    <div>
                    <div className={`text-sm font-medium ${isTaskOverdue ? 'text-red-800' : 'text-gray-900'}`}>{task.title}</div>
                    <div className="text-sm text-gray-500">ID: {task.id}</div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${task.status === 'done' ? 'bg-green-100 text-green-800' : 
                    task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    task.status === 'todo' ? 'bg-gray-100 text-gray-800' :
                    'bg-yellow-100 text-yellow-800'}`}>
                    {statusOptions.find(s => s.value === task.status)?.label || task.status}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${task.priority === 'high' ? 'bg-red-100 text-red-800' : 
                    task.priority === 'urgent' ? 'bg-purple-100 text-purple-800' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'}`}>
                    {priorityOptions.find(p => p.value === task.priority)?.label || task.priority}
                </span>
            </td>
            <td className={`px-6 py-4 whitespace-nowrap text-sm ${isTaskOverdue ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
                {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}
                
                {isTaskOverdue && (
                    <span className="ml-2 flex items-center text-xs">
                        <ClockIcon className="h-3 w-3 mr-1" />
                        Overdue
                    </span>
                )}
                
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                    onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(task);
                    }}
                    className={`${editId === task.id ? 'text-green-600 hover:text-green-900' : 'text-indigo-600 hover:text-indigo-900'} mr-4`}
                >
                    <PencilIcon className="h-5 w-5" />
                </button>
                <button
                    onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(task.id);
                    }}
                    className="text-red-600 hover:text-red-900"
                >
                    <TrashIcon className="h-5 w-5" />
                </button>
            </td>
        </tr>
        {expanded && (
            <tr className={`bg-gray-50 ${isTaskOverdue ? 'bg-red-50' : ''}`}>
            <td colSpan="5" className="px-6 py-4">
                {children}
            </td>
            </tr>
        )}
        </>
    );
};

export default TaskRow;
