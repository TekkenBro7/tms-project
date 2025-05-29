import React from 'react';

const UserDetails = ({ user }) => {
    if (!user) {
        return <div>Загрузка данных...</div>;
    }

    return (
        <div className="grid grid-cols-2 gap-6">
            <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">Информация о пользователе</h3>
                <p><span className="text-gray-600">Аккаунт:</span> {user.username}</p>
                <p><span className="text-gray-600">Имя:</span> {user.first_name} {user.last_name}</p>
                <p><span className="text-gray-600">Email:</span> {user.email}</p>
            </div>
            <div>
                <p><span className="text-gray-600">Дата регистрации:</span> {new Date(user.date_joined).toLocaleDateString()}</p>
                <p><span className="text-gray-600">Администратор:</span> 
                    <span className={`ml-2 px-2 inline-flex text-xs font-semibold rounded-full 
                        ${user.is_superuser ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                        {user.is_superuser ? 'Да' : 'Нет'}
                    </span>
                </p>
                <p><span className="text-gray-600">Последний вход:</span> {user.last_login ? new Date(user.last_login).toLocaleString() : 'Никогда'}</p>
            </div>
        </div>
    );
};

export default UserDetails;
