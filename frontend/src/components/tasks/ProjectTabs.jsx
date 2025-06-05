import React from 'react';

const ProjectTabs = ({ projects, activeProjectTab, setActiveProjectTab }) => {
    return (
        <div className="flex mb-4 border-b border-gray-200">
        {projects.map((project) => (
            <button
            key={project.id}
            className={`px-4 py-2 font-medium text-sm ${activeProjectTab === project.id ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveProjectTab(project.id)}
            >
            {project.name}
            </button>
        ))}
        </div>
    );
};

export default ProjectTabs;
