import React from 'react';

const TaskTabs = ({ tasks, activeTaskTab, setActiveTaskTab }) => {
    return (
        <div className="flex mb-4 border-b border-gray-200">
            {tasks.map((task) => (
                <button
                    key={task.id}
                    className={`px-4 py-2 font-medium text-sm ${activeTaskTab === task.id ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTaskTab(task.id)}
                >
                    {task.title || `Task ID: ${task.id}`}
                </button>
            ))}
        </div>
    );
};

export default TaskTabs;
