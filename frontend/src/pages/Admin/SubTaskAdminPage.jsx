import React, { useEffect, useState } from 'react';
import { PlusIcon } from '@heroicons/react/outline';
import subtaskService from '../../services/SubtaskService';
import userService from '../../services/UserService';
import taskService from '../../services/TaskService';
import TaskTabs from '../../components/subtasks/TaskTabs';
import SubtaskForm from '../../components/subtasks/SubtaskForm';
import SubtasksTable from '../../components/subtasks/SubtasksTable';

const getLocalDateString = () => {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset()); // учёт часового пояса
    return today.toISOString().split('T')[0];
};

const SubtaskAdminPage = () => {
    const [subtasksByTask, setSubtasksByTask] = useState({});
    const [expandedRows, setExpandedRows] = useState([]);
    const [subtaskDetails, setSubtaskDetails] = useState({});
    const [formData, setFormData] = useState({
        title: '',
        status: 'todo',
        task: '',
        assignee: '',
        deadline: ''
    });
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState({
        subtasks: true,
        details: false,
        users: false,
        tasks: false
    });
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [activeTaskTab, setActiveTaskTab] = useState(null);
    const [isCreating, setIsCreating] = useState(false);

    const statusOptions = [
        { value: 'todo', label: 'To Do' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'in_review', label: 'In Review' },
        { value: 'in_qa', label: 'In QA' },
        { value: 'rejected', label: 'Rejected' },
        { value: 'canceled', label: 'Canceled' },
        { value: 'done', label: 'Done' }
    ];

    const creationStatusOptions = [{ value: 'todo', label: 'To Do' }];

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([
                    fetchSubtasks(),
                    fetchUsers(),
                    fetchTasks()
                ]);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (tasks.length > 0 && !activeTaskTab) {
            setActiveTaskTab(tasks[0]?.id);
        }
    }, [tasks]);

    const fetchSubtasks = async () => {
        try {
            setLoading(prev => ({ ...prev, subtasks: true }));
            const response = await subtaskService.getAll();
            
            const subtasksWithDetails = await Promise.all(
                response.data.map(async subtask => {
                    if (!subtask.deadline || !subtask.task) {
                        try {
                            const detailResponse = await subtaskService.getById(subtask.id);
                            return detailResponse.data;
                        } catch (e) {
                            return subtask;
                        }
                    }
                    return subtask;
                })
            );
            
            const grouped = subtasksWithDetails.reduce((acc, subtask) => {
                const taskId = subtask.task;
                if (!acc[taskId]) acc[taskId] = [];
                acc[taskId].push(subtask);
                return acc;
            }, {});
            
            setSubtasksByTask(grouped);
        } catch (err) {
            setError(err.response?.data || err.message);
        } finally {
            setLoading(prev => ({ ...prev, subtasks: false }));
        }
    };

    const fetchSubtaskDetails = async (id) => {
        try {
            setLoading(prev => ({ ...prev, details: true }));
            const response = await subtaskService.getById(id);
            setSubtaskDetails(prev => ({
                ...prev,
                [id]: response.data
            }));
        } catch (err) {
            setError(err.response?.data || err.message);
        } finally {
            setLoading(prev => ({ ...prev, details: false }));
        }
    };

    const fetchUsers = async () => {
        try {
            setLoading(prev => ({ ...prev, users: true }));
            const response = await userService.getAll();
            setUsers(response.data);
        } catch (err) {
            console.error('Error loading users', err);
        } finally {
            setLoading(prev => ({ ...prev, users: false }));
        }
    };

    const fetchTasks = async () => {
        try {
            setLoading(prev => ({ ...prev, tasks: true }));
            const response = await taskService.getAll();
            setTasks(response.data);
        } catch (err) {
            console.error('Error loading tasks', err);
        } finally {
            setLoading(prev => ({ ...prev, tasks: false }));
        }
    };

    const handleInput = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        const today = new Date().toISOString().split('T')[0];
        
        if (value < today) {
            setError('Deadline cannot be in the past');
            return;
        }
        
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.deadline) {
            const today = getLocalDateString();
            if (formData.deadline < today) {
                setError('Deadline cannot be in the past');
                return;
            }
        }
        try {
            if (editId) {
                await subtaskService.update(editId, formData);
            } else {
                await subtaskService.create(formData);
            }
            await fetchSubtasks();
            resetForm();
        } catch (err) {
            setError(err.response?.data || err.message);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            status: 'todo',
            task: activeTaskTab || '',
            assignee: '',
            deadline: ''
        });
        setEditId(null);
        setIsCreating(false);
    };

    const handleEdit = async (subtask) => {
        if (editId === subtask.id) {
            resetForm();
            return;
        }

        try {
            const response = await subtaskService.getById(subtask.id);
            const subtaskData = response.data;

            setFormData({
                title: subtaskData.title,
                status: subtaskData.status,
                task: subtaskData.task,
                assignee: subtaskData.assignee,
                deadline: subtaskData.deadline ? subtaskData.deadline.split('T')[0] : ''
            });
            setEditId(subtask.id);
            setIsCreating(false);
        } catch (err) {
            setError(err.response?.data || err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this subtask?')) return;
        try {
            await subtaskService.delete(id);
            await fetchSubtasks();
            if (editId === id) resetForm();
        } catch (err) {
            setError(err.response?.data || err.message);
        }
    };

    const toggleRow = async (id) => {
        if (expandedRows.includes(id)) {
            setExpandedRows(expandedRows.filter(rowId => rowId !== id));
        } else {
            setExpandedRows([...expandedRows, id]);
            if (!subtaskDetails[id]) {
                await fetchSubtaskDetails(id);
            }
        }
    };

    const getTaskTitle = (taskId) => {
        const task = tasks.find(t => t.id === taskId);
        return task ? task.title : `Task ID: ${taskId}`;
    };

    const getUserName = (userId) => {
        const user = users.find(u => u.id === userId);
        return user ? user.username || user.email : `User ID: ${userId}`;
    };

    const startCreating = () => {
        resetForm();
        setIsCreating(true);
        if (activeTaskTab) {
            setFormData(prev => ({
                ...prev,
                task: activeTaskTab
            }));
        }
    };

    const filteredSubtasks = activeTaskTab 
        ? subtasksByTask[activeTaskTab] || []
        : [];

    if (loading.subtasks) return <div className="text-center py-12">Loading subtasks...</div>;
    if (error) return <div className="text-center py-12 text-red-500">Error: {error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-800">Subtask Management</h1>
                {!isCreating && !editId && (
                    <button
                        onClick={startCreating}
                        className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-4 py-2 rounded shadow-lg hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 flex items-center"
                    >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Create Subtask
                    </button>
                )}
            </div>

            {(isCreating || editId) && (
                <SubtaskForm
                    formData={formData}
                    editId={editId}
                    statusOptions={statusOptions}
                    creationStatusOptions={creationStatusOptions}
                    tasks={tasks}
                    users={users}
                    handleInput={handleInput}
                    handleDateChange={handleDateChange}
                    handleSubmit={handleSubmit}
                    onCancel={resetForm}
                    error={error}
                />
            )}

            {tasks.length > 0 && (
                <TaskTabs 
                    tasks={tasks} 
                    activeTaskTab={activeTaskTab} 
                    setActiveTaskTab={setActiveTaskTab} 
                />
            )}

            <SubtasksTable
                subtasks={filteredSubtasks}
                expandedRows={expandedRows}
                subtaskDetails={subtaskDetails}
                loading={loading}
                statusOptions={statusOptions}
                toggleRow={toggleRow}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                editId={editId}
                getTaskTitle={getTaskTitle}
                getUserName={getUserName}
            />
        </div>
    );
};

export default SubtaskAdminPage;
