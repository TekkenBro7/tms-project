import React, { useState } from 'react';
import TaskItem from './TaskItem';
import taskService from '../../services/TaskService';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/outline';

const ProjectCard = ({ project, currentUser }) => {
    const [expanded, setExpanded] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const response = await taskService.getAll();
            const projectTasks = response.data.filter(task => task.project === project.id);
            setTasks(projectTasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleExpand = () => {
        if (!expanded) {
            fetchTasks();
        }
        setExpanded(!expanded);
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
            <div 
                className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                onClick={toggleExpand}
            >
                <div>
                    <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
                    <p className="text-sm text-gray-500">{project.description}</p>
                </div>
                <div className="flex items-center">
                    <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                        {project.is_active ? 'Active' : 'Inactive'}
                    </span>
                    {expanded ? (
                        <ChevronDownIcon className="h-5 w-5 ml-2 text-gray-400" />
                    ) : (
                        <ChevronRightIcon className="h-5 w-5 ml-2 text-gray-400" />
                    )}
                </div>
            </div>
        
            {expanded && (
                <div className="border-t border-gray-200 p-4">
                    {loading ? (
                        <div className="text-center py-4">Loading tasks...</div>
                    ) : tasks.length > 0 ? (
                        <div className="space-y-4">
                            {tasks.map(task => (
                                <TaskItem key={task.id} task={task} currentUser={currentUser} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-4 text-gray-500">No tasks in this project</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProjectCard;
