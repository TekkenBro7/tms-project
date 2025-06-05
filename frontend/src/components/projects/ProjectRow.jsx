import React from 'react';
import { ChevronDownIcon, ChevronRightIcon, PencilIcon, TrashIcon } from '@heroicons/react/outline';

const ProjectRow = ({
    project,
    expanded,
    editId,
    toggleRow,
    handleEdit,
    handleDelete,
    children
}) => {
    return (
        <>
            <tr 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => toggleRow(project.id)}
            >
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        {expanded ? (
                            <ChevronDownIcon className="h-5 w-5 mr-2 text-gray-400" />
                        ) : (
                            <ChevronRightIcon className="h-5 w-5 mr-2 text-gray-400" />
                        )}
                        <div>
                            <div className="text-sm font-medium text-gray-900">{project.name}</div>
                            <div className="text-sm text-gray-500">ID: {project.id}</div>
                        </div>
                    </div>
                </td>
                <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                        {project.description || '—'}
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(project);
                        }}
                        className={`${editId === project.id ? 'text-green-600 hover:text-green-900' : 'text-indigo-600 hover:text-indigo-900'} mr-4`}
                    >
                        <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(project.id);
                        }}
                        className="text-red-600 hover:text-red-900"
                    >
                        <TrashIcon className="h-5 w-5" />
                    </button>
                </td>
            </tr>
            {expanded && (
                <tr className="bg-gray-50">
                    <td colSpan="3" className="px-6 py-4">
                        {children}
                    </td>
                </tr>
            )}
        </>
    );
};

export default ProjectRow;
