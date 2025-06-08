import React, { useState } from 'react';
import { 
    PencilIcon, 
    TrashIcon, 
    ChevronDownIcon, 
    ChevronRightIcon, 
    ArrowUpIcon, 
    ArrowDownIcon, 
    SearchIcon,
    ClockIcon
} from '@heroicons/react/outline';

const STATUS_ORDER = {
    'todo': 0,
    'in_progress': 1,
    'in_review': 2,
    'in_qa': 3,
    'rejected': 4,
    'canceled': 5,
    'done': 6
};

const PRIORITY_ORDER = {
    'low': 0,
    'medium': 1,
    'high': 2,
    'urgent': 3
};

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
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: 'ascending'
    });
    const [searchTerm, setSearchTerm] = useState('');

    const isOverdue = (deadline, status) => {
        if (!deadline || status === 'done') return false;
        
        const deadlineDate = new Date(deadline);
        const today = new Date();
        
        // Устанавливаем время на конец дня для дедлайна
        deadlineDate.setHours(23, 59, 59, 999);
        
        return deadlineDate < today;
    };

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return null;
        return sortConfig.direction === 'ascending' 
            ? <ArrowUpIcon className="h-4 w-4 ml-1" /> 
            : <ArrowDownIcon className="h-4 w-4 ml-1" />;
    };

    const sortedSubtasks = React.useMemo(() => {
        let filteredSubtasks = subtasks;
        
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filteredSubtasks = subtasks.filter(subtask => 
                subtask.title.toLowerCase().includes(term) ||
                subtask.status.toLowerCase().includes(term) ||
                (subtask.deadline && new Date(subtask.deadline).toLocaleDateString().toLowerCase().includes(term)) ||
                subtask.id.toString().includes(term) ||
                (getUserName(subtask.assignee) || '').toLowerCase().includes(term));
        }

        if (!sortConfig.key) return filteredSubtasks;

        return [...filteredSubtasks].sort((a, b) => {
            if (sortConfig.key === 'status') {
                const aValue = STATUS_ORDER[a.status] || 0;
                const bValue = STATUS_ORDER[b.status] || 0;
                return sortConfig.direction === 'ascending' 
                    ? aValue - bValue 
                    : bValue - aValue;
            }

            if (sortConfig.key === 'priority') {
                const aValue = PRIORITY_ORDER[a.priority] || 0;
                const bValue = PRIORITY_ORDER[b.priority] || 0;
                return sortConfig.direction === 'ascending' 
                    ? aValue - bValue 
                    : bValue - aValue;
            }

            if (sortConfig.key === 'deadline') {
                const aDate = a.deadline ? new Date(a.deadline).getTime() : 0;
                const bDate = b.deadline ? new Date(b.deadline).getTime() : 0;
                return sortConfig.direction === 'ascending' 
                    ? (aDate - bDate) 
                    : (bDate - aDate);
            }

            if (sortConfig.key === 'assignee') {
                const aName = getUserName(a.assignee) || '';
                const bName = getUserName(b.assignee) || '';
                if (aName < bName) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (aName > bName) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            }

            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
    }, [subtasks, sortConfig, searchTerm, getUserName]);

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200">
                <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md p-2 border"
                        placeholder="Search subtasks..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => requestSort('title')}
                            >
                                <div className="flex items-center">
                                    Title
                                    {getSortIcon('title')}
                                </div>
                            </th>
                            <th 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => requestSort('status')}
                            >
                                <div className="flex items-center">
                                    Status
                                    {getSortIcon('status')}
                                </div>
                            </th>
                            <th 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => requestSort('assignee')}
                            >
                                <div className="flex items-center">
                                    Assignee
                                    {getSortIcon('assignee')}
                                </div>
                            </th>
                            <th 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => requestSort('deadline')}
                            >
                                <div className="flex items-center">
                                    Deadline
                                    {getSortIcon('deadline')}
                                </div>
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sortedSubtasks.length > 0 ? (
                            sortedSubtasks.map((subtask) => {
                                const isSubtaskOverdue = isOverdue(subtask.deadline, subtask.status);
                                
                                return (
                                    <React.Fragment key={subtask.id}>
                                        <tr 
                                            className={`hover:bg-gray-50 cursor-pointer ${isSubtaskOverdue ? 'bg-red-50' : ''}`}
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
                                                        <div className={`text-sm font-medium ${isSubtaskOverdue ? 'text-red-800' : 'text-gray-900'}`}>
                                                            {subtask.title}
                                                        </div>
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
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${isSubtaskOverdue ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
                                                {subtask.deadline ? new Date(subtask.deadline).toLocaleDateString() : 'No deadline'}
                                                {isSubtaskOverdue && (
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
                                            <tr className={`bg-gray-50 ${isSubtaskOverdue ? 'bg-red-50' : ''}`}>
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
                                );
                            })
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
