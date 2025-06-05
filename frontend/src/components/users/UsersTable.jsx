import React from 'react';
import UserRow from './UserRow';

const UsersTable = ({
    users,
    expandedUser,
    userDetails,
    toggleUserDetails,
    handleDelete
}) => {
    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                        <UserRow
                            key={user.id}
                            user={user}
                            expanded={expandedUser === user.id}
                            userDetails={userDetails}
                            toggleUserDetails={toggleUserDetails}
                            handleDelete={handleDelete}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UsersTable;
