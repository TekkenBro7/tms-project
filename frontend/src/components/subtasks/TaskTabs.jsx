import React from 'react';

const TaskTabs = ({ tasks, activeTaskTab, setActiveTaskTab }) => {
    return (
        <div className="mb-4 overflow-x-auto">
            <div className="flex whitespace-nowrap pb-2" style={{ minWidth: '100%' }}>
                {tasks.map((task) => (
                    <button
                        key={task.id}
                        className={`px-4 py-2 font-medium text-sm flex-shrink-0 ${
                            activeTaskTab === task.id 
                                ? 'text-indigo-600 border-b-2 border-indigo-600' 
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setActiveTaskTab(task.id)}
                    >
                        {task.title || `Task ID: ${task.id}`}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TaskTabs;
