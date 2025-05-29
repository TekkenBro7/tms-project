import React, { useEffect, useState } from 'react';
import taskService from '../services/taskService';
import userService from '../services/userService';
import projectService from '../services/projectService';
import TaskForm from '../components/tasks/TaskForm';
import ProjectTabs from '../components/tasks/ProjectTabs';
import TasksTable from '../components/tasks/TasksTable';

const getLocalDateString = () => {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset()); // учёт часового пояса
    return today.toISOString().split('T')[0];
};

const TaskAdminPage = () => {
    const [tasksByProject, setTasksByProject] = useState({});
    const [expandedRows, setExpandedRows] = useState([]);
    const [taskDetails, setTaskDetails] = useState({});
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        project: '',
        assignee: '',
        deadline: ''
    });
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState({
        tasks: true,
        details: false
    });
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [activeProjectTab, setActiveProjectTab] = useState(null);

    const statusOptions = [
        { value: 'todo', label: 'To Do' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'in_review', label: 'In Review' },
        { value: 'in_qa', label: 'In QA' },
        { value: 'rejected', label: 'Rejected' },
        { value: 'canceled', label: 'Canceled' },
        { value: 'done', label: 'Done' }
    ];

    const priorityOptions = [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
        { value: 'urgent', label: 'Urgent' }
    ];

    const fetchTasks = async () => {
        try {
            setLoading(prev => ({...prev, tasks: true}));
            const response = await taskService.getAll();
            
            const tasksWithDetails = await Promise.all(
                response.data.map(async task => {
                if (!task.deadline || !task.project) {
                    try {
                        const detailResponse = await taskService.getById(task.id);
                        return detailResponse.data;
                    } catch (e) {
                        return task;
                    }
                }
                return task;
                })
            );
            
            const grouped = tasksWithDetails.reduce((acc, task) => {
                const projectId = task.project;
                if (!acc[projectId]) {
                    acc[projectId] = [];
                }
                acc[projectId].push(task);
                return acc;
            }, {});
            
            setTasksByProject(grouped);
            
            if (projects.length > 0 && !activeProjectTab) {
                setActiveProjectTab(projects[0].id);
            }
        } catch (err) {
            setError(err.response?.data || err.message);
        } finally {
            setLoading(prev => ({...prev, tasks: false}));
        }
    };

    const fetchTaskDetails = async (id) => {
        try {
        setLoading(prev => ({...prev, details: true}));
            const response = await taskService.getById(id);
            setTaskDetails(prev => ({
                ...prev,
                [id]: response.data
            }));
        } catch (err) {
            setError(err.response?.data || err.message);
        } finally {
            setLoading(prev => ({...prev, details: false}));
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await userService.getAll();
            setUsers(response.data);
        } catch (err) {
            console.error('Error loading users', err);
        }
    };

    const fetchProjects = async () => {
        try {
            const response = await projectService.getAll();
            setProjects(response.data);
            
            if (response.data.length > 0) {
                setActiveProjectTab(response.data[0].id);
                setFormData(prev => ({
                ...prev,
                project: response.data[0].id
                }));
            }
        } catch (err) {
            console.error('Error loading projects', err);
        }
    };

    useEffect(() => {
        fetchTasks();
        fetchUsers();
        fetchProjects();
    }, []);

    const handleInput = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        const today = getLocalDateString();
        
        if (value < today) {
            setError('Deadline cannot be in the past');
            return;
        }
        
        setFormData(prev => ({
        ...prev,
        [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.deadline) {
            const today = new Date().toISOString().split('T')[0];
            if (formData.deadline < today) {
                setError('Deadline cannot be in the past');
                return;
            }
        }
    
        try {
            const dataToSend = editId ? formData : { ...formData, status: 'todo' };
        
            if (editId) {
                await taskService.update(editId, dataToSend);
            } else {
                await taskService.create(dataToSend);
            }
            fetchTasks();
            resetForm();
        } catch (err) {
            setError(err.response?.data || err.message);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            status: 'todo',
            priority: 'medium',
            project: activeProjectTab || (projects.length > 0 ? projects[0].id : ''),
            assignee: '',
            deadline: ''
        });
        setEditId(null);
    };

    const handleEdit = async (task) => {
        if (editId === task.id) {
            resetForm();
            return;
        }

        try {
            const response = await taskService.getById(task.id);
            const taskData = response.data;

            setFormData({
                title: taskData.title,
                description: taskData.description,
                status: taskData.status,
                priority: taskData.priority,
                project: taskData.project,
                assignee: taskData.assignee,
                deadline: taskData.deadline ? taskData.deadline.split('T')[0] : ''
            });
            setEditId(task.id);
        } catch (err) {
            setError(err.response?.data || err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;
        try {
            await taskService.delete(id);
            fetchTasks();
            if (editId === id) {
                resetForm();
            }
        } catch (err) {
            setError(err.response?.data || err.message);
        }
    };

    const toggleRow = async (id) => {
        if (expandedRows.includes(id)) {
            setExpandedRows(expandedRows.filter(rowId => rowId !== id));
        } else {
            setExpandedRows([...expandedRows, id]);
            if (!taskDetails[id]) {
                await fetchTaskDetails(id);
            }
        }
    };

    const getProjectName = (projectId) => {
        const project = projects.find(p => p.id === projectId);
        return project ? project.name : 'No Project';
    };

    if (loading.tasks) return <div className="text-center py-12">Loading tasks...</div>;
    if (error) return <div className="text-center py-12 text-red-500">Error: {error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-800">Task Management</h1>
            </div>

            <TaskForm
                formData={formData}
                editId={editId}
                statusOptions={statusOptions}
                priorityOptions={priorityOptions}
                users={users}
                projects={projects}
                handleInput={handleInput}
                handleDateChange={handleDateChange}
                handleSubmit={handleSubmit}
            />

            <ProjectTabs
                projects={projects}
                activeProjectTab={activeProjectTab}
                setActiveProjectTab={setActiveProjectTab}
            />

            <TasksTable
                tasks={tasksByProject[activeProjectTab] || []}
                projects={projects}
                expandedRows={expandedRows}
                taskDetails={taskDetails}
                loading={loading}
                statusOptions={statusOptions}
                priorityOptions={priorityOptions}
                toggleRow={toggleRow}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                editId={editId}
                getProjectName={getProjectName}
            />
        </div>
    );
};

export default TaskAdminPage;
