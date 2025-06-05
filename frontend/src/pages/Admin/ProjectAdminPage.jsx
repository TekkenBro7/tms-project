import React, { useEffect, useState } from "react";
import ProjectService from "../../services/projectService";
import userService from "../../services/userService";
import ProjectForm from "../../components/projects/ProjectForm";
import ProjectsTable from "../../components/projects/ProjectTable";

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

            <ProjectForm 
                formData={formData}
                editId={editId}
                users={users}
                handleInput={handleInput}
                handleSubmit={handleSubmit}
                setFormData={setFormData}
            />

            <ProjectsTable
                projects={projects}
                expandedRows={expandedRows}
                projectDetails={projectDetails}
                loading={loading}
                usersMap={usersMap}
                toggleRow={toggleRow}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                editId={editId}
            />
        </div>
    );
};

export default ProjectAdminPage;
