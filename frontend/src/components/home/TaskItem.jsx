import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import taskService from '../../services/TaskService';
import subtaskService from '../../services/SubtaskService';
import { 
    ChevronDownIcon, 
    ChevronRightIcon, 
    CheckCircleIcon,
    PencilIcon,
    ClockIcon,
    UserCircleIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    SwitchVerticalIcon
} from '@heroicons/react/outline';
import SubtaskModal from './SubtaskModal';

const statusOrder = {
    'todo': 1,
    'in_progress': 2,
    'in_review': 3,
    'done': 4
};

const TaskItem = ({ task, currentUser }) => {
    const [expanded, setExpanded] = useState(false);
    const [subtasks, setSubtasks] = useState([]);
    const [selectedSubtask, setSelectedSubtask] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    
    const fetchSubtasks = async () => {
        try {
            const response = await taskService.getById(task.id);
            setSubtasks(response.data.subtasks || []);
        } catch (error) {
            console.error('Error fetching subtasks:', error);
        }
    };

    const toggleExpand = () => {
        if (!expanded) {
            fetchSubtasks();
        }
        setExpanded(!expanded);
    };

    const handleSubtaskClick = (subtask) => {
        setSelectedSubtask(subtask);
    };

    const handleSaveSubtask = async (updatedData) => {
        try {
            const response = await subtaskService.partialUpdate(selectedSubtask.id, updatedData);
            setSubtasks(prev => prev.map(st => 
                st.id === selectedSubtask.id ? { ...st, ...response.data } : st
            ));
            setSelectedSubtask(null);
        } catch (error) {
            console.error('Error updating subtask:', error);
        }
    };

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedSubtasks = useMemo(() => {
        if (!sortConfig.key) return subtasks;

        return [...subtasks].sort((a, b) => {
            if (sortConfig.key === 'status') {
                const statusA = statusOrder[a.status] || 0;
                const statusB = statusOrder[b.status] || 0;
                if (statusA < statusB) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (statusA > statusB) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            }

            if (sortConfig.key === 'assignee') {
                const isCurrentUserA = a.assignee === currentUser.id;
                const isCurrentUserB = b.assignee === currentUser.id;
                if (isCurrentUserA && !isCurrentUserB) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (!isCurrentUserA && isCurrentUserB) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            }

            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }, [subtasks, sortConfig, currentUser.id]);

    const isOverdue = (deadline) => {
        if (!deadline) return false;
        
        const deadlineDate = new Date(deadline);
        const today = new Date();
        
        deadlineDate.setHours(23, 59, 59, 999);
        
        return deadlineDate < today;
    };

    const isTaskOverdue = task.deadline && isOverdue(task.deadline) && task.status !== 'done';

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return <SwitchVerticalIcon className="h-3 w-3 ml-1" />;
        return sortConfig.direction === 'asc' 
            ? <ArrowUpIcon className="h-3 w-3 ml-1" /> 
            : <ArrowDownIcon className="h-3 w-3 ml-1" />;
    };

    return (
        <>
            <div className={`border border-gray-200 rounded-lg ${isTaskOverdue ? 'border-red-300 bg-red-50' : ''}`}>
                <div 
                    className={`p-3 flex justify-between items-center cursor-pointer hover:bg-gray-50 ${isTaskOverdue ? 'bg-red-50' : ''}`}
                    onClick={toggleExpand}
                >
                    <div className="flex items-center">
                        <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                        task.status === 'done' ? 'bg-green-500' : 
                        task.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-300'
                        }`}></span>
                        <span className="font-medium">{task.title}</span>
                        {isTaskOverdue && (
                        <span className="ml-2 flex items-center text-xs text-red-600">
                            <ClockIcon className="h-3 w-3 mr-1" />
                            Overdue
                        </span>
                        )}
                    </div>
                    <div className="flex items-center">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                        task.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                        task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                        }`}>
                        {task.priority}
                        </span>
                        {expanded ? (
                        <ChevronDownIcon className="h-4 w-4 ml-2 text-gray-400" />
                        ) : (
                        <ChevronRightIcon className="h-4 w-4 ml-2 text-gray-400" />
                        )}
                    </div>
                </div>
            
                {expanded && (
                <div className="border-t border-gray-200 p-3 bg-gray-50">
                    <div className="flex justify-between text-sm mb-2">
                    <span className={`${isTaskOverdue ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                        Deadline: {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'None'}
                    </span>
                    <span className="text-gray-500">Status: {task.status}</span>
                    </div>
                    
                    {task.description && (
                    <p className="text-sm text-gray-700 mb-3">{task.description}</p>
                    )}
                    
                    {sortedSubtasks.length > 0 && (
                    <div className="mt-2">
                        <div className="flex justify-between items-center mb-1">
                            <h4 className="text-sm font-medium text-gray-500">Subtasks ({sortedSubtasks.length})</h4>
                            <div className="flex space-x-2 text-xs">
                                <button 
                                    onClick={() => requestSort('status')}
                                    className="flex items-center text-gray-500 hover:text-indigo-600"
                                >
                                    Status {getSortIcon('status')}
                                </button>
                                <button 
                                    onClick={() => requestSort('assignee')}
                                    className="flex items-center text-gray-500 hover:text-indigo-600"
                                >
                                    Assignee {getSortIcon('assignee')}
                                </button>
                                <button 
                                    onClick={() => requestSort('deadline')}
                                    className="flex items-center text-gray-500 hover:text-indigo-600"
                                >
                                    Deadline {getSortIcon('deadline')}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2">
                        {sortedSubtasks.map(subtask => {
                            const isSubtaskOverdue = subtask.deadline && isOverdue(subtask.deadline) && subtask.status !== 'done';
                            const canEditSubtask = subtask.assignee === currentUser.id || currentUser.is_superuser;
                            const isAssignedToMe = subtask.assignee === currentUser.id;
                            
                            return (
                            <div 
                                key={subtask.id} 
                                className={`flex items-center justify-between p-2 rounded border ${isSubtaskOverdue ? 'border-red-200 bg-red-50' : 'border-gray-100 bg-white'} ${isAssignedToMe ? 'ring-1 ring-indigo-200' : ''}`}
                                onClick={() => handleSubtaskClick(subtask)}
                            >
                                <div className="flex items-center">
                                {subtask.status === 'done' ? (
                                    <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                                ) : (
                                    <span className={`inline-block w-3 h-3 rounded-full mr-2 ${isSubtaskOverdue ? 'bg-red-500' : 'bg-gray-300'}`}></span>
                                )}
                                <div className="flex flex-col">
                                    <span className="text-sm">{subtask.title}</span>
                                    <div className="flex items-center mt-1">
                                        <span className={`text-xs px-1 rounded ${
                                            subtask.status === 'done' ? 'bg-green-100 text-green-800' : 
                                            subtask.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                            subtask.status === 'in_review' ? 'bg-purple-100 text-purple-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {subtask.status.replace('_', ' ')}
                                        </span>
                                        {subtask.assignee_name && (
                                        <span className="flex items-center text-xs text-gray-500 ml-2">
                                            <UserCircleIcon className="h-3 w-3 mr-1" />
                                            {subtask.assignee_name}
                                        </span>
                                        )}
                                    </div>
                                </div>
                                {isSubtaskOverdue && (
                                    <span className="ml-2 flex items-center text-xs text-red-600">
                                    <ClockIcon className="h-3 w-3 mr-1" />
                                    Overdue
                                    </span>
                                )}
                                </div>
                                <div className="flex items-center">
                                <span className="text-xs text-gray-500 mr-2">
                                    {subtask.deadline ? new Date(subtask.deadline).toLocaleDateString() : 'No deadline'}
                                </span>
                                {canEditSubtask && (
                                    <PencilIcon className="h-4 w-4 text-gray-400 hover:text-indigo-600" />
                                )}
                                </div>
                            </div>
                            );
                        })}
                        </div>
                    </div>
                    )}
                </div>
                )}
            </div>

            {selectedSubtask && (
                <SubtaskModal 
                    subtask={selectedSubtask}
                    currentUser={currentUser}
                    onClose={() => setSelectedSubtask(null)}
                    onSave={handleSaveSubtask}
                />
            )}
        </>
    );
};

export default TaskItem;
