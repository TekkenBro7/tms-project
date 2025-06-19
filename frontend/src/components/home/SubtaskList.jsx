import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    UserCircleIcon, 
    ArrowUpIcon, 
    ArrowDownIcon, 
    CheckCircleIcon, 
    ClockIcon,
    PencilIcon,
    ArrowRightIcon
} from '@heroicons/react/outline';
import { useMemo } from 'react';
import { TaskStatus, SortKey } from '../../constants/enums';  

const statusOrder = {
    [TaskStatus.TODO]: 1,
    [TaskStatus.IN_PROGRESS]: 2,
    [TaskStatus.IN_REVIEW]: 3,
    [TaskStatus.IN_QA]: 4,
    [TaskStatus.REJECTED]: 5,
    [TaskStatus.CANCELED]: 6,
    [TaskStatus.DONE]: 7
};  

const SubtaskList = ({ subtasks, currentUser, sortConfig, setSortConfig, onSubtaskClick }) => {
    const navigate = useNavigate();

    const sortedSubtasks = useMemo(() => {
        if (!sortConfig.key) return subtasks;

        return [...subtasks].sort((a, b) => {
            if (sortConfig.key === SortKey.STATUS) {
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

            if (sortConfig.key === SortKey.ASSIGNEE) {
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

            if (sortConfig.key === SortKey.ASSIGNEE) {
                if (!a.deadline && !b.deadline) return 0;
                if (!a.deadline) return sortConfig.direction === 'asc' ? 1 : -1;
                if (!b.deadline) return sortConfig.direction === 'asc' ? -1 : 1;
                
                const dateA = new Date(a.deadline);
                const dateB = new Date(b.deadline);
                
                if (dateA < dateB) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (dateA > dateB) {
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

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return null;
        return sortConfig.direction === 'asc' 
            ? <ArrowUpIcon className="h-3 w-3 ml-1" /> 
            : <ArrowDownIcon className="h-3 w-3 ml-1" />;
    };

    const handleViewDetails = (subtaskId, e) => {
        e.stopPropagation();
        navigate(`/subtasks/${subtaskId}`);
    };

    const handleSubtaskClick = (subtask, e) => {
        e.stopPropagation();
        onSubtaskClick(subtask);
    };

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium text-gray-500">
                    Subtasks ({subtasks.length})
                </h4>
                <div className="flex space-x-3">
                    <button 
                        onClick={() => handleSort('status')}
                        className="text-xs text-gray-500 hover:text-indigo-600 flex items-center"
                    >
                        Status {getSortIcon('status')}
                    </button>
                    <button 
                        onClick={() => handleSort('assignee')}
                        className="text-xs text-gray-500 hover:text-indigo-600 flex items-center"
                    >
                        Assignee {getSortIcon('assignee')}
                    </button>
                    <button 
                        onClick={() => handleSort('deadline')}
                        className="text-xs text-gray-500 hover:text-indigo-600 flex items-center"
                    >
                        Deadline {getSortIcon('deadline')}
                    </button>
                </div>
            </div>
            
            <motion.div layout className="space-y-2">
                {sortedSubtasks.map(subtask => {
                    const isSubtaskOverdue = subtask.deadline && isOverdue(subtask.deadline) && subtask.status !== TaskStatus.DONE;
                    const isAssignedToMe = subtask.assignee === currentUser.id;
                    const canEditSubtask = isAssignedToMe || currentUser.is_superuser;

                    return (
                        <motion.div
                            key={subtask.id}
                            layout
                            whileHover={{ x: 3 }}
                            onClick={() => navigate(`/subtasks/${subtask.id}`)}
                            className={`p-3 rounded-lg border cursor-pointer transition hover:shadow-sm ${
                                isSubtaskOverdue ? 'border-red-200 bg-red-50' : 
                                isAssignedToMe ? 'border-indigo-200 bg-indigo-50' : 
                                'border-gray-100 bg-white'
                            }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1 flex items-start space-x-3">
                                    {subtask.status === TaskStatus.DONE ? (
                                        <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                    ) : (
                                        <div className={`h-4 w-4 rounded-full mt-1 flex-shrink-0 ${
                                            isSubtaskOverdue ? 'bg-red-500' : 'bg-gray-300'
                                        }`} />
                                    )}
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{subtask.title}</p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            <span className={`text-xs px-2 py-1 rounded-full ${
                                                subtask.status === TaskStatus.DONE ? 'bg-green-100 text-green-800' : 
                                                subtask.status === TaskStatus.IN_PROGRESS ? 'bg-blue-100 text-blue-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {subtask.status.replace('_', ' ')}
                                            </span>
                                            {subtask.assignee_name && (
                                                <span className="flex items-center text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                                                    <UserCircleIcon className="h-3 w-3 mr-1" />
                                                    {subtask.assignee_name}
                                                </span>
                                            )}
                                            {subtask.deadline && (
                                                <span className={`text-xs px-2 py-1 rounded-full ${
                                                    isSubtaskOverdue ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {new Date(subtask.deadline).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                    {isSubtaskOverdue && (
                                        <span className="flex items-center text-xs text-red-600">
                                            <ClockIcon className="h-3 w-3 mr-1" />
                                            Overdue
                                        </span>
                                    )}

                                    <button 
                                        onClick={(e) => handleViewDetails(subtask.id, e)}
                                        className="text-gray-400 hover:text-indigo-600"
                                        title="View details"
                                    >
                                        <ArrowRightIcon className="h-4 w-4" />
                                    </button>
                                    
                                    {canEditSubtask && (
                                        <button 
                                            onClick={(e) => handleSubtaskClick(subtask, e)}
                                            className="text-gray-400 hover:text-indigo-600"
                                        >
                                            <PencilIcon className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    );
};

export default SubtaskList;
