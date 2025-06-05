import React from 'react';
import ProjectRow from './ProjectRow';
import ProjectDetails from './ProjectDetails';

const ProjectsTable = ({
    projects,
    expandedRows,
    projectDetails,
    loading,
    usersMap,
    toggleRow,
    handleEdit,
    handleDelete,
    editId
}) => {
    return (
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
                        {projects.length > 0 ? (
                            projects.map((project) => (
                                <ProjectRow
                                    key={project.id}
                                    project={project}
                                    expanded={expandedRows.includes(project.id)}
                                    editId={editId}
                                    toggleRow={toggleRow}
                                    handleEdit={handleEdit}
                                    handleDelete={handleDelete}
                                >
                                    <ProjectDetails 
                                        project={projectDetails[project.id]} 
                                        usersMap={usersMap} 
                                        loading={loading.details} 
                                    />
                                </ProjectRow>
                            ))
                        ) : (
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
    );
};

export default ProjectsTable;
