import React from 'react';
import { UserGroupIcon, ChartBarIcon } from '@heroicons/react/outline';

const ProjectDetails = ({ project, usersMap, loading }) => {
    if (loading) {
        return <div className="text-center py-4">Loading project details...</div>;
    }

    if (!project) {
        return <div className="text-center py-4 text-red-500">Failed to load project details</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Status</h3>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${project.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {project.is_active ? 'Active' : 'Inactive'}
                </span>
            </div>
            <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Members</h3>
                <div className="flex items-center">
                    <UserGroupIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-500">
                        {project.members?.length || 0} members
                    </span>
                </div>
                {project.members?.length > 0 && (
                    <div className="mt-2">
                        <ul className="text-sm text-gray-700 space-y-1">
                            {project.members.map(memberId => {
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
                            {project.progress || 0}%
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                                className="bg-indigo-600 h-2 rounded-full" 
                                style={{ width: `${project.progress || 0}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Owner</h3>
                <div className="text-sm text-gray-900">
                    {project.owner_name || 'Not specified'}
                </div>
            </div>
            <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Created At</h3>
                <div className="text-sm text-gray-900">
                    {new Date(project.created_at).toLocaleString()}
                </div>
            </div>
            <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Updated At</h3>
                <div className="text-sm text-gray-900">
                    {new Date(project.updated_at).toLocaleString()}
                </div>
            </div>
        </div>
    );
};

export default ProjectDetails;
