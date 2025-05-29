import React from 'react';

const TaskDetails = ({ task, getProjectName }) => {
    if (!task) return <div className="text-center py-4 text-red-500">Failed to load task details</div>;

    return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
            <p className="text-sm text-gray-900">{task.description || 'No description'}</p>
        </div>

        <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Assignee</h3>
            <p className="text-sm text-gray-900">
                {task.assignee_name || 'Unassigned'}
            </p>
        </div>

        <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Project</h3>
            <p className="text-sm text-gray-900">
            {getProjectName(task.project)}
            </p>
        </div>

        <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Created At</h3>
            <p className="text-sm text-gray-900">
                {new Date(task.created_at).toLocaleString()}
            </p>
        </div>

        <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Updated At</h3>
            <p className="text-sm text-gray-900">
                {new Date(task.updated_at).toLocaleString()}
            </p>
        </div>
        
        <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Completed At</h3>
            <p className="text-sm text-gray-900">
                {task.completed_at ? new Date(task.completed_at).toLocaleString() : 'Not completed'}
            </p>
        </div>
    </div>
    );
};

export default TaskDetails;
