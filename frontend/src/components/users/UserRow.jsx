import React from 'react';
import { Link } from 'react-router-dom';
import { PencilIcon, TrashIcon } from "@heroicons/react/outline";
import UserDetails from './UserDetails';

const UserRow = ({
    user,
    expanded,
    userDetails,
    toggleUserDetails,
    handleDelete
}) => {
    return (
        <>
            <tr 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => toggleUserDetails(user.id)}
            >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                            {user.avatar ? (
                                <img className="h-10 w-10 rounded-full" src={user.avatar} alt="" />
                            ) : (
                                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                    <span className="text-indigo-600 font-medium">
                                        {user.username.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.username}</div>
                            <div className="text-sm text-gray-500">{user.first_name} {user.last_name}</div>
                        </div>
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                        to={`/admin/users/edit/${user.id}`}
                        className="text-indigo-600 hover:text-indigo-900 mr-7"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <PencilIcon className="h-5 w-5" />
                    </Link>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(user.id);
                        }}
                        className="text-red-600 hover:text-red-900"
                    >
                        <TrashIcon className="h-5 w-5" />
                    </button>
                </td>
            </tr>
            {expanded && (
                <tr className="bg-gray-50">
                    <td colSpan="4" className="px-6 py-4">
                        <UserDetails user={userDetails[user.id]} />
                    </td>
                </tr>
            )}
        </>
    );
};

export default UserRow;
