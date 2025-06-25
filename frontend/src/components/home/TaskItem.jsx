import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ClockIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    ArrowRightIcon
} from '@heroicons/react/outline';
import { useNavigate } from 'react-router-dom';
import SubtaskModal from './SubtaskModal';
import taskService from '../../services/TaskService';
import SubtaskList from './SubtaskList';
import { TaskStatus, Priority } from '../../constants/enums';
import subtaskService from '../../services/SubtaskService'


const statusColors = {
    [TaskStatus.TODO]: 'bg-gray-200 text-gray-800',
    [TaskStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
    [TaskStatus.IN_REVIEW]: 'bg-purple-100 text-purple-800',
    [TaskStatus.IN_QA]: 'bg-yellow-100 text-yellow-800',
    [TaskStatus.REJECTED]: 'bg-red-100 text-red-800',
    [TaskStatus.CANCELED]: 'bg-gray-100 text-gray-500',
    [TaskStatus.DONE]: 'bg-green-100 text-green-800'
};

const priorityColors = {
    [Priority.LOW]: 'bg-gray-100 text-gray-800',
    [Priority.MEDIUM]: 'bg-blue-100 text-blue-800',
    [Priority.HIGH]: 'bg-orange-100 text-orange-800',
    [Priority.URGENT]: 'bg-red-100 text-red-800'
};

const TaskItem = ({ task, currentUser, isProjectActive }) => {
    const [expanded, setExpanded] = useState(false);
    const [subtasks, setSubtasks] = useState([]);
    const [selectedSubtask, setSelectedSubtask] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const navigate = useNavigate();
    
    const isOverdue = (deadline) => {
        if (!deadline) return false;
        const deadlineDate = new Date(deadline);
        const today = new Date();
        deadlineDate.setHours(23, 59, 59, 999);
        return deadlineDate < today && task.status !== TaskStatus.DONE;
    };

    const isTaskOverdue = isOverdue(task.deadline);

    const toggleExpand = async () => {
        if (!expanded) {
            try {
                const response = await taskService.getById(task.id);
                setSubtasks(response.data.subtasks || []);
            } catch (error) {
                console.error('Error fetching subtasks:', error);
            }
        }
        setExpanded(!expanded);
    };

    const handleViewDetails = (e) => {
        e.stopPropagation();
        navigate(`/tasks/${task.id}`);
    };

    return (
        <motion.div 
            layout
            className={`rounded-lg overflow-hidden shadow-sm ${isTaskOverdue ? 'border-l-4 border-red-500' : ''}`}
            whileHover={{ scale: 1.01 }}
        >
            <motion.div 
                layout
                className={`p-4 cursor-pointer ${isTaskOverdue ? 'bg-red-50' : 'bg-white'}`}
                onClick={toggleExpand}
            >
                <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                        <div className={`mt-1 w-4 h-4 rounded-full flex-shrink-0 ${
                            task.status === 'done' ? 'bg-green-500' : 
                            isTaskOverdue ? 'bg-red-500' :
                            'bg-gray-300'
                        }`} />
                        <div>
                            <h4 className="font-medium text-gray-800">{task.title}</h4>
                            <div className="flex flex-wrap gap-2 mt-2">
                                <span className={`text-xs px-2 py-1 rounded-full ${statusColors[task.status] || 'bg-gray-100'}`}>
                                    {task.status.replace('_', ' ')}
                                </span>
                                <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[task.priority] || 'bg-gray-100'}`}>
                                    {task.priority}
                                </span>
                                {isTaskOverdue && (
                                    <span className="flex items-center text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">
                                        <ClockIcon className="h-3 w-3 mr-1" />
                                        Overdue
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button 
                            onClick={handleViewDetails}
                            className="text-gray-400 hover:text-indigo-600 transition"
                            title="View details"
                        >
                            <ArrowRightIcon className="h-5 w-5" />
                        </button>
                        <motion.div 
                            animate={{ rotate: expanded ? 180 : 0 }}
                            className="text-gray-400"
                        >
                            {expanded ? (
                                <ChevronDownIcon className="h-5 w-5" />
                            ) : (
                                <ChevronRightIcon className="h-5 w-5" />
                            )}
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            <AnimatePresence>
                {expanded && (
                    <motion.div
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-gray-50 border-t"
                    >
                        <div className="p-4 space-y-4">
                            {task.description && (
                                <p className="text-sm text-gray-600">{task.description}</p>
                            )}
                            
                            <div className="flex justify-between text-sm">
                                <span className={`${isTaskOverdue ? 'text-red-600' : 'text-gray-500'}`}>
                                    <strong>Deadline:</strong> {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'None'}
                                </span>
                                <button 
                                    onClick={handleViewDetails}
                                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                >
                                    View full details →
                                </button>
                            </div>

                            {subtasks.length > 0 ? (
                                <SubtaskList 
                                    subtasks={subtasks}
                                    currentUser={currentUser}
                                    sortConfig={sortConfig}
                                    setSortConfig={setSortConfig}
                                    onSubtaskClick={setSelectedSubtask}
                                    isProjectActive={isProjectActive}
                                />
                            ) : (
                                <div className="text-center py-3 text-gray-400 text-sm">
                                    No subtasks for this task
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {selectedSubtask && (
                <SubtaskModal 
                    subtask={selectedSubtask}
                    currentUser={currentUser}
                    onClose={() => setSelectedSubtask(null)}
                    isProjectActive={isProjectActive}
                    onSave={async (updatedData) => {
                        if (!isProjectActive) return;

                        try {
                            const minimalData = {
                                status: updatedData.status,
                                title: updatedData.title,
                                deadline: updatedData.deadline,
                                task: selectedSubtask.task,
                                assignee: selectedSubtask.assignee
                            };
                            await subtaskService.update(selectedSubtask.id, minimalData);

                            setSubtasks(prev => prev.map(st => 
                                st.id === selectedSubtask.id ? { ...st, ...updatedData } : st
                            ));
                        } catch (error) {
                            console.error('Error updating subtask:', error);
                        } finally {
                            setSelectedSubtask(null);
                        }
                    }}
                />
            )}
        </motion.div>
    );
};

export default TaskItem;
