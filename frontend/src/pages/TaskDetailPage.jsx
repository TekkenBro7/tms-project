import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ClockIcon,
    UserCircleIcon,
    ArrowLeftIcon,
    PencilIcon
} from '@heroicons/react/outline';
import taskService from '../services/TaskService';
import SubtaskList from '../components/home/SubtaskList';
import { AuthContext } from '../utils/AuthContext';
import { TaskStatus, Priority } from '../constants/enums';

const priorityColors = {
    [Priority.LOW]: 'bg-gray-100 text-gray-800',
    [Priority.MEDIUM]: 'bg-blue-100 text-blue-800',
    [Priority.HIGH]: 'bg-orange-100 text-orange-800',
    [Priority.URGENT]: 'bg-red-100 text-red-800'
};

const statusColors = {
    [TaskStatus.TODO]: 'bg-gray-200 text-gray-800',
    [TaskStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
    [TaskStatus.IN_REVIEW]: 'bg-purple-100 text-purple-800',
    [TaskStatus.IN_QA]: 'bg-yellow-100 text-yellow-800',
    [TaskStatus.REJECTED]: 'bg-red-100 text-red-800',
    [TaskStatus.CANCELED]: 'bg-gray-100 text-gray-500',
    [TaskStatus.DONE]: 'bg-green-100 text-green-800'
};

const PriorityBadge = ({ priority }) => {
    return (
        <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[priority] || 'bg-gray-100'}`}>
            {priority}
        </span>
    );
};

const StatusBadge = ({ status }) => {
    return (
        <span className={`text-xs px-2 py-1 rounded-full ${statusColors[status] || 'bg-gray-100'}`}>
            {status.replace('_', ' ')}
        </span>
    );
};

const TaskDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const { user: currentUser } = useContext(AuthContext);

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const response = await taskService.getById(id);
                setTask(response.data);
            } catch (error) {
                console.error('Error fetching task:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTask();
    }, [id, navigate]);

    const isOverdue = (deadline) => {
        if (!deadline) return false;
        const deadlineDate = new Date(deadline);
        const today = new Date();
        deadlineDate.setHours(23, 59, 59, 999);
        return deadlineDate < today && task.status !== TaskStatus.DONE;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-40 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!task) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6 text-center">
                    <h2 className="text-xl font-semibold text-gray-800">Task not found</h2>
                    <button
                        onClick={() => navigate('/')}
                        className="mt-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-2 px-4 rounded-md shadow-lg hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Go back
                    </button>
                </div>
            </div>
        );
    }

    const isTaskOverdue = isOverdue(task.deadline);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen bg-gray-50 p-4 md:p-6"
        >
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-600 hover:text-indigo-600 mb-6"
                >
                    <ArrowLeftIcon className="h-5 w-5 mr-2" />
                    Back to tasks
                </button>

                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className={`p-6 ${isTaskOverdue ? 'bg-red-50' : 'bg-white'}`}>
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800 mb-2">{task.title}</h1>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <StatusBadge status={task.status} />
                                    <PriorityBadge priority={task.priority} />
                                    {isTaskOverdue && (
                                        <span className="flex items-center text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">
                                            <ClockIcon className="h-3 w-3 mr-1" />
                                            Overdue
                                        </span>
                                    )}
                                </div>
                            </div>
                            {currentUser.id === task.author?.id && (
                                <button className="text-gray-400 hover:text-indigo-600">
                                    <PencilIcon className="h-5 w-5" />
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="md:col-span-3">
                                <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                                <p className="text-gray-700 whitespace-pre-line">
                                    {task.description || 'No description provided'}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Project</h3>
                                <p className="text-indigo-600 font-semibold">
                                    {task.project_name || 'Unknown project'}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Assignee</h3>
                                <div className="flex items-center">
                                    <UserCircleIcon className="h-5 w-5 text-gray-400 mr-2" />
                                    <span className="text-gray-700">
                                        {task.assignee_name || 'Unassigned'}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Author</h3>
                                <div className="flex items-center">
                                    <UserCircleIcon className="h-5 w-5 text-gray-400 mr-2" />
                                    <span className="text-gray-700">
                                        {task.author_name || 'Unknown'}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Deadline</h3>
                                <p className={`text-gray-700 ${isTaskOverdue ? 'text-red-600' : ''}`}>
                                    {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Created</h3>
                                <p className="text-gray-700">
                                    {new Date(task.created_at).toLocaleDateString()}
                                </p>
                            </div>

                            

                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Last Updated</h3>
                                <p className="text-gray-700">
                                    {task.updated_at ? new Date(task.updated_at).toLocaleString() : 'N/A'}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Completed At</h3>
                                <p className="text-gray-700">
                                    {task.completed_at ? new Date(task.completed_at).toLocaleString() : 'Not completed'}
                                </p>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Subtasks</h2>
                            {task.subtasks?.length > 0 ? (
                                <SubtaskList
                                    subtasks={task.subtasks}
                                    currentUser={currentUser}
                                    sortConfig={sortConfig}
                                    setSortConfig={setSortConfig}
                                />
                            ) : (
                                <div className="text-center py-6 bg-gray-50 rounded-lg">
                                    <p className="text-gray-500">No subtasks for this task</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default TaskDetailPage;
