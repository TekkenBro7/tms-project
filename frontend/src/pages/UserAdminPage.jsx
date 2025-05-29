import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PencilIcon, TrashIcon } from "@heroicons/react/outline";
import UserService from '../services/userService';

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedUser, setExpandedUser] = useState(null);
    const [userDetails, setUserDetails] = useState({});

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await UserService.getAll();
                console.log(data)
                setUsers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        
        fetchUsers();
    }, []);

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await UserService.delete(userId);
                setUsers(users.filter(user => user.id !== userId));
                setExpandedUser(null);
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const toggleUserDetails = async (userId) => {
        if (expandedUser === userId) {
            setExpandedUser(null);
            return;
        }

        if (!userDetails[userId]) {
            try {
                const { data } = await UserService.getById(userId);
                setUserDetails(prev => ({ ...prev, [userId]: data }));
                console.log(data)
            } catch (err) {
                setError(`Failed to fetch user details: ${err.message}`);
                return;
            }
        }

        setExpandedUser(userId);
    };

    if (loading) return <div className="text-center py-8">Loading users...</div>;
    if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
                <Link 
                    to="/admin/users/create" 
                    className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-4 py-2 rounded shadow-lg hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500"
                >
                    Add New User
                </Link>
            </div>
            
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
                            <>
                                <tr 
                                    key={user.id} 
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
                                {expandedUser === user.id && (
                                    <tr className="bg-gray-50">
                                        <td colSpan="4" className="px-6 py-4">
                                        {userDetails[user.id] ? (
                                            <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <h3 className="font-semibold text-lg text-gray-900 mb-2">Информация о пользователе</h3>
                                                <p><span className="text-gray-600">Аккаун:</span> {userDetails[user.id].username}</p>
                                                <p><span className="text-gray-600">Имя:</span> {userDetails[user.id].first_name} {userDetails[user.id].last_name}</p>
                                                <p><span className="text-gray-600">Email:</span> {userDetails[user.id].email}</p>
                                            </div>
                                            <div>
                                                <p><span className="text-gray-600">Дата регистрации:</span> {new Date(userDetails[user.id].date_joined).toLocaleDateString()}</p>
                                                <p><span className="text-gray-600">Администратор:</span> 
                                                <span className={`ml-2 px-2 inline-flex text-xs font-semibold rounded-full 
                                                    ${userDetails[user.id].is_superuser ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                                                    {userDetails[user.id].is_superuser ? 'Да' : 'Нет'}
                                                </span>
                                                </p>
                                                <p><span className="text-gray-600">Последний вход:</span> {userDetails[user.id].last_login ? new Date(userDetails[user.id].last_login).toLocaleString() : 'Никогда'}</p>
                                            </div>
                                            </div>
                                        ) : (
                                            <div>Загрузка данных...</div>
                                        )}
                                        </td>
                                    </tr>
                                )}
                            </>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}