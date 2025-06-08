const ProjectTabs = ({ projects, activeProjectTab, setActiveProjectTab }) => {
    return (
        <div className="mb-4 overflow-x-auto">
            <div className="flex whitespace-nowrap pb-2" style={{ minWidth: '100%' }}>
                {projects.map((project) => (
                    <button
                        key={project.id}
                        className={`px-4 py-2 font-medium text-sm flex-shrink-0 ${
                            activeProjectTab === project.id 
                                ? 'text-indigo-600 border-b-2 border-indigo-600' 
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setActiveProjectTab(project.id)}
                    >
                        {project.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ProjectTabs;
