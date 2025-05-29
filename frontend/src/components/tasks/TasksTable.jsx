import React from 'react';
import TaskRow from './TaskRow';
import TaskDetails from './TaskDetails';

const TasksTable = ({
    tasks,
    projects,
    expandedRows,
    taskDetails,
    loading,
    statusOptions,
    priorityOptions,
    toggleRow,
    handleEdit,
    handleDelete,
    editId,
    getProjectName
}) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {tasks?.length > 0 ? (
                tasks.map((task) => (
                    <TaskRow
                    key={task.id}
                    task={task}
                    expanded={expandedRows.includes(task.id)}
                    editId={editId}
                    statusOptions={statusOptions}
                    priorityOptions={priorityOptions}
                    toggleRow={toggleRow}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                    >
                    {loading.details ? (
                        <div className="text-center py-4">Loading task details...</div>
                    ) : (
                        <TaskDetails 
                        task={taskDetails[task.id]} 
                        getProjectName={getProjectName} 
                        />
                    )}
                    </TaskRow>
                ))
                ) : (
                <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    No tasks found for this project. Create your first task.
                    </td>
                </tr>
                )}
            </tbody>
            </table>
        </div>
        </div>
    );
};

export default TasksTable;
