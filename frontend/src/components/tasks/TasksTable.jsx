import React, { useState } from 'react';
import { SearchIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/outline';
import TaskRow from './TaskRow';

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

const TasksTable = ({
    tasks,
    projects,
    expandedRows,
    taskDetails,
    loading,
    statusOptions,
    priorityOptions,
    toggleRow,
    handleEdit,
    handleDelete,
    editId,
    getProjectName
}) => {
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: 'ascending'
    });
    const [searchTerm, setSearchTerm] = useState('');

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

    const filteredAndSortedTasks = React.useMemo(() => {
        let filteredTasks = tasks;
        
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filteredTasks = tasks.filter(task => 
                task.title.toLowerCase().includes(term) ||
                task.status.toLowerCase().includes(term) ||
                task.priority.toLowerCase().includes(term) ||
                (task.deadline && new Date(task.deadline).toLocaleDateString().toLowerCase().includes(term)) ||
                task.id.toString().includes(term));
        }

        if (!sortConfig.key) return filteredTasks;

        return [...filteredTasks].sort((a, b) => {
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

            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
    }, [tasks, sortConfig, searchTerm]);

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
                        placeholder="Search tasks..."
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
                                onClick={() => requestSort('priority')}
                            >
                                <div className="flex items-center">
                                    Priority
                                    {getSortIcon('priority')}
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
                        {filteredAndSortedTasks?.length > 0 ? (
                            filteredAndSortedTasks.map((task) => (
                                <TaskRow
                                    key={task.id}
                                    task={task}
                                    expanded={expandedRows.includes(task.id)}
                                    editId={editId}
                                    statusOptions={statusOptions}
                                    priorityOptions={priorityOptions}
                                    toggleRow={toggleRow}
                                    handleEdit={handleEdit}
                                    handleDelete={handleDelete}
                                >
                                    {loading.details ? (
                                        <div className="text-center py-4">Loading task details...</div>
                                    ) : (
                                        taskDetails[task.id] && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <h3 className="text-sm font-medium text-gray-500 mb-2">Project</h3>
                                                    <p className="text-sm text-gray-900">
                                                        {getProjectName(taskDetails[task.id].project)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-medium text-gray-500 mb-2">Created At</h3>
                                                    <p className="text-sm text-gray-900">
                                                        {new Date(taskDetails[task.id].created_at).toLocaleString()}
                                                    </p>
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-medium text-gray-500 mb-2">Updated At</h3>
                                                    <p className="text-sm text-gray-900">
                                                        {new Date(taskDetails[task.id].updated_at).toLocaleString()}
                                                    </p>
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-medium text-gray-500 mb-2">Completed At</h3>
                                                    <p className="text-sm text-gray-900">
                                                        {taskDetails[task.id].completed_at ? 
                                                            new Date(taskDetails[task.id].completed_at).toLocaleString() : 
                                                            'Not completed'}
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </TaskRow>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                    No tasks found for this project. Create your first task.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TasksTable;
