import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/outline';
import TaskItem from './TaskItem';
import taskService from '../../services/TaskService';

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

    const toggleExpand = async () => {
        if (!expanded && tasks.length === 0) {
            await fetchTasks();
        }
        setExpanded(!expanded);
    };

    return (
        <motion.div 
            layout
            className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-200 ${expanded ? 'shadow-lg' : 'hover:shadow-lg'}`}
            whileHover={{ y: -3 }}
        >
            <motion.div 
                layout
                className="p-5 cursor-pointer"
                onClick={toggleExpand}
            >
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center mb-2">
                            <div className={`w-3 h-3 rounded-full mr-3 ${project.is_active ? 'bg-green-500' : 'bg-gray-400'}`} />
                            <h3 className="text-xl font-semibold text-gray-800">{project.name}</h3>
                        </div>
                        <p className="text-gray-500 text-sm line-clamp-2">{project.description}</p>
                    </div>
                    <motion.div 
                        animate={{ rotate: expanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {expanded ? (
                            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                        ) : (
                            <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                        )}
                    </motion.div>
                </div>
            </motion.div>

            <AnimatePresence>
                {expanded && (
                    <motion.div
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-100"
                    >
                        <div className="p-5">
                            {loading ? (
                                <div className="space-y-3">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
                                    ))}
                                </div>
                            ) : tasks.length > 0 ? (
                                <div className="space-y-4">
                                    {tasks.map(task => (
                                        <TaskItem 
                                            key={task.id} 
                                            task={task} 
                                            currentUser={currentUser} 
                                            isProjectActive={project.is_active}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <img 
                                        src="/images/no-tasks.svg" 
                                        alt="No tasks" 
                                        className="w-40 mx-auto mb-3 opacity-70"
                                    />
                                    <p className="text-gray-400">No tasks in this project yet</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ProjectCard;
