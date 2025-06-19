import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ClockIcon,
    UserCircleIcon,
    ArrowLeftIcon,
    PencilIcon,
} from '@heroicons/react/outline';
import subtaskService from '../services/SubtaskService';
import { AuthContext } from '../utils/AuthContext';
import SubtaskModal from '../components/home/SubtaskModal';
import { TaskStatus } from '../constants/enums';

const statusColors = {
    [TaskStatus.TODO]: 'bg-gray-200 text-gray-800',
    [TaskStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
    [TaskStatus.IN_REVIEW]: 'bg-purple-100 text-purple-800',
    [TaskStatus.IN_QA]: 'bg-yellow-100 text-yellow-800',
    [TaskStatus.REJECTED]: 'bg-red-100 text-red-800',
    [TaskStatus.CANCELED]: 'bg-gray-100 text-gray-500',
    [TaskStatus.DONE]: 'bg-green-100 text-green-800'
};

const SubtaskDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [subtask, setSubtask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const { user: currentUser } = useContext(AuthContext);

    useEffect(() => {
        const fetchSubtask = async () => {
            try {
                const response = await subtaskService.getById(id);
                setSubtask(response.data);
            } catch (error) {
                console.error('Error fetching subtask:', error);
                navigate('/not-found', { replace: true });
            } finally {
                setLoading(false);
            }
        };

        fetchSubtask();
    }, [id, navigate]);

    const isOverdue = (deadline) => {
        if (!deadline) return false;
        const deadlineDate = new Date(deadline);
        const today = new Date();
        deadlineDate.setHours(23, 59, 59, 999);
        return deadlineDate < today && subtask?.status !== TaskStatus.DONE;
    };

    const handleSave = async (updatedData) => {
        try {
            const response = await subtaskService.partialUpdate(subtask.id, updatedData);
            setSubtask(response.data);
            setShowModal(false);
        } catch (error) {
            console.error('Error updating subtask:', error);
        }
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

    if (!subtask) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6 text-center">
                    <h2 className="text-xl font-semibold text-gray-800">Subtask not found</h2>
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-2 px-4 rounded-md shadow-lg hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500"
                    >
                        Go back
                    </button>
                </div>
            </div>
        );
    }

    const isSubtaskOverdue = isOverdue(subtask.deadline);
    const canEdit = subtask.assignee === currentUser?.id || currentUser?.is_superuser;

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
                    Back to task
                </button>

                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className={`p-6 ${isSubtaskOverdue ? 'bg-red-50' : 'bg-white'}`}>
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800 mb-2">{subtask.title}</h1>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className={`text-xs px-2 py-1 rounded-full ${statusColors[subtask.status] || 'bg-gray-100'}`}>
                                        {subtask.status.replace('_', ' ')}
                                    </span>
                                    {isSubtaskOverdue && (
                                        <span className="flex items-center text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">
                                            <ClockIcon className="h-3 w-3 mr-1" />
                                            Overdue
                                        </span>
                                    )}
                                </div>
                            </div>
                            {canEdit && (
                                <button 
                                    onClick={() => setShowModal(true)}
                                    className="text-gray-400 hover:text-indigo-600"
                                >
                                    <PencilIcon className="h-5 w-5" />
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="md:col-span-3">
                                <p className="text-sm text-gray-500">
                                        Parent Task: <span className="font-medium text-gray-700">{subtask.task_title}</span>
                                </p>
                                {subtask.project_title && (
                                    <p className="text-sm text-gray-500">
                                        Project: <span className="font-medium text-gray-700">{subtask.project_title}</span>
                                    </p>
                                )}
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Assignee</h3>
                                <div className="flex items-center">
                                    <UserCircleIcon className="h-5 w-5 text-gray-400 mr-2" />
                                    <span className="text-gray-700">
                                        {subtask.assignee_name || 'Unassigned'}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Deadline</h3>
                                <p className={`text-gray-700 ${isSubtaskOverdue ? 'text-red-600' : ''}`}>
                                    {subtask.deadline ? new Date(subtask.deadline).toLocaleDateString() : 'No deadline'}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Created</h3>
                                <p className="text-gray-700">
                                    {new Date(subtask.created_at).toLocaleDateString()}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Last Updated</h3>
                                <p className="text-gray-700">
                                    {subtask.updated_at ? new Date(subtask.updated_at).toLocaleString() : 'N/A'}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Completed At</h3>
                                <p className="text-gray-700">
                                    {subtask.completed_at ? new Date(subtask.completed_at).toLocaleString() : 'Not completed'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showModal && (
                <SubtaskModal
                    subtask={subtask}
                    currentUser={currentUser}
                    onClose={() => setShowModal(false)}
                    onSave={handleSave}
                />
            )}
        </motion.div>
    );
};

export default SubtaskDetailPage;
