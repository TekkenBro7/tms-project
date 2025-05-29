// ProjectAdminPage.js
import React, { useEffect, useState } from "react";
import ProjectService from "../services/projectService";
import { PencilIcon, TrashIcon, PlusIcon, UserGroupIcon, ChartBarIcon, ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/outline";
import userService from "../services/userService";

const ProjectAdminPage = () => {
    const [projects, setProjects] = useState([]);
    const [expandedRows, setExpandedRows] = useState([]);
    const [projectDetails, setProjectDetails] = useState({});
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        is_active: true,
        owner: "",        
        members: [], 
    });
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState({
        projects: true,
        details: false
    });
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);
    const [usersMap, setUsersMap] = useState({});

    const fetchProjects = async () => {
        try {
            setLoading(prev => ({...prev, projects: true}));
            const response = await ProjectService.getAll();
            setProjects(response.data);
        } catch (err) {
            setError(err.response?.data || err.message);
        } finally {
            setLoading(prev => ({...prev, projects: false}));
        }
    };

    const fetchProjectDetails = async (id) => {
        try {
            setLoading(prev => ({...prev, details: true}));
            const response = await ProjectService.getById(id);
            setProjectDetails(prev => ({
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
            const map = {};
            response.data.forEach(user => {
                map[user.id] = user;
            });
            setUsersMap(map);
        } catch (err) {
            console.error("Error loading users", err);
        }
    };

    useEffect(() => {
        fetchProjects();
        fetchUsers();
    }, []);

    const handleInput = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await ProjectService.update(editId, formData);
            } else {
                await ProjectService.create(formData);
            }
            fetchProjects();
            resetForm();
        } catch (err) {
            setError(err.response?.data || err.message);
        }
    };

    const resetForm = () => {
        setFormData({ 
            name: "", 
            description: "", 
            is_active: true,
            owner: "",
            members: [] 
        });
        setEditId(null);
    };

    const handleEdit = async (proj) => {
        if (editId === proj.id) {
            resetForm();
            return;
        }

        try {
            const response = await ProjectService.getById(proj.id);
            const project = response.data;

            setFormData({
                name: project.name,
                description: project.description,
                is_active: project.is_active,
                owner: project.owner,
                members: project.members || [],
            });
            setEditId(project.id);
        } catch (err) {
            setError(err.response?.data || err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this project?")) return;
        try {
            await ProjectService.delete(id);
            fetchProjects();
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
            if (!projectDetails[id]) {
                await fetchProjectDetails(id);
            }
        }
    };

    if (loading.projects) return <div className="text-center py-12">Loading projects...</div>;
    if (error) return <div className="text-center py-12 text-red-500">Error: {error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-800">Project Management</h1>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">
                    {editId ? "Edit Project" : "Create New Project"}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Project Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInput}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Owner *</label>
                            <select
                                name="owner"
                                value={formData.owner}
                                onChange={handleInput}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="">Select owner</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.username || user.email}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Members</label>
                            <select
                                name="members"
                                multiple
                                value={formData.members}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        members: Array.from(e.target.selectedOptions, (option) => option.value),
                                    }))
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.username || user.email}
                                    </option>
                                ))}
                            </select>
                            <p className="text-sm text-gray-400 mt-1">Use Ctrl/Command for multiple selection</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInput}
                                className="w-full h-24 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none" // Добавьте resize-none
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="is_active"
                                name="is_active"
                                checked={formData.is_active}
                                onChange={handleInput}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                                Active project
                            </label>
                        </div>
                        <button
                            type="submit"
                            className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-10 py-2 rounded shadow-lg hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 flex items-center"
                        >
                            <PlusIcon className="h-5 w-5 mr-2" />
                            {editId ? "Save Changes" : "Create Project"}
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Description
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {projects.map((project) => (
                                <React.Fragment key={project.id}>
                                    <tr 
                                        className="hover:bg-gray-50 cursor-pointer"
                                        onClick={() => toggleRow(project.id)}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {expandedRows.includes(project.id) ? (
                                                    <ChevronDownIcon className="h-5 w-5 mr-2 text-gray-400" />
                                                ) : (
                                                    <ChevronRightIcon className="h-5 w-5 mr-2 text-gray-400" />
                                                )}
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{project.name}</div>
                                                    <div className="text-sm text-gray-500">ID: {project.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 max-w-xs truncate">
                                                {project.description || '—'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEdit(project);
                                                }}
                                                className={`${editId === project.id ? 'text-green-600 hover:text-green-900' : 'text-indigo-600 hover:text-indigo-900'} mr-4`}
                                            >
                                                <PencilIcon className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(project.id);
                                                }}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                    {expandedRows.includes(project.id) && (
                                        <tr className="bg-gray-50">
                                            <td colSpan="3" className="px-6 py-4">
                                                {loading.details ? (
                                                    <div className="text-center py-4">Loading project details...</div>
                                                ) : (
                                                    projectDetails[project.id] ? (
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            <div>
                                                                <h3 className="text-sm font-medium text-gray-500 mb-2">Status</h3>
                                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                                    ${projectDetails[project.id].is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                                    {projectDetails[project.id].is_active ? 'Active' : 'Inactive'}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <h3 className="text-sm font-medium text-gray-500 mb-2">Members</h3>
                                                                <div className="flex items-center">
                                                                    <UserGroupIcon className="h-5 w-5 text-gray-400 mr-2" />
                                                                    <span className="text-sm text-gray-500">
                                                                        {projectDetails[project.id].members?.length || 0} members
                                                                    </span>
                                                                </div>
                                                                {projectDetails[project.id].members?.length > 0 && (
                                                                    <div className="mt-2">
                                                                        <ul className="text-sm text-gray-700 space-y-1">
                                                                            {projectDetails[project.id].members.map(memberId => {
                                                                                const member = usersMap[memberId];
                                                                                return (
                                                                                    <li key={memberId}>
                                                                                        {member ? (member.username || member.email) : `User ID: ${memberId}`}
                                                                                    </li>
                                                                                );
                                                                            })}
                                                                        </ul>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <h3 className="text-sm font-medium text-gray-500 mb-2">Progress</h3>
                                                                <div className="flex items-center">
                                                                    <ChartBarIcon className="h-5 w-5 text-indigo-400 mr-2" />
                                                                    <div className="w-full">
                                                                        <div className="text-sm text-gray-500 mb-1">
                                                                            {projectDetails[project.id].progress || 0}%
                                                                        </div>
                                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                                            <div 
                                                                                className="bg-indigo-600 h-2 rounded-full" 
                                                                                style={{ width: `${projectDetails[project.id].progress || 0}%` }}
                                                                            ></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <h3 className="text-sm font-medium text-gray-500 mb-2">Owner</h3>
                                                                <div className="text-sm text-gray-900">
                                                                    {projectDetails[project.id].owner_name || 'Not specified'}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <h3 className="text-sm font-medium text-gray-500 mb-2">Created At</h3>
                                                                <div className="text-sm text-gray-900">
                                                                    {new Date(projectDetails[project.id].created_at).toLocaleString()}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <h3 className="text-sm font-medium text-gray-500 mb-2">Updated At</h3>
                                                                <div className="text-sm text-gray-900">
                                                                    {new Date(projectDetails[project.id].updated_at).toLocaleString()}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="text-center py-4 text-red-500">Failed to load project details</div>
                                                    )
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                            {projects.length === 0 && (
                                <tr>
                                    <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                                        No projects found. Create your first project.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProjectAdminPage;