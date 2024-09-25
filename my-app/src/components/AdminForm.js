import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminForm() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Помилка при отриманні користувачів:', error);
    }
  };

  const handleInputChange = (e, index, field) => {
    const newUsers = [...users];
    newUsers[index][field] = e.target.value;
    setUsers(newUsers);
  };

  const handleSubmit = async (index) => {
    try {
      await axios.put(`/users/${users[index]._id}`, users[index], {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Користувач успішно оновлений');
    } catch (error) {
      console.error('Помилка при оновленні користувача:', error);
    }
  };

  const filteredUsers = users.filter(user =>
    user.login.toLowerCase().includes(filter.toLowerCase()) ||
    user.fullName.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Фільтр"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th>Логін</th>
            <th>Повне ім'я</th>
            <th>Регіон</th>
            <th>ЦПМСД</th>
            <th>Амбулаторія</th>
            <th>Новий пароль</th>
            <th>Роль</th>
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, index) => (
            <tr key={user._id}>
              <td>{user.login}</td>
              <td>
                <input
                  value={user.fullName}
                  onChange={(e) => handleInputChange(e, index, 'fullName')}
                />
              </td>
              <td>
                <input
                  value={user.region}
                  onChange={(e) => handleInputChange(e, index, 'region')}
                />
              </td>
              <td>
                <input
                  value={user.cpmsd}
                  onChange={(e) => handleInputChange(e, index, 'cpmsd')}
                />
              </td>
              <td>
                <input
                  value={user.ambulatoriya}
                  onChange={(e) => handleInputChange(e, index, 'ambulatoriya')}
                />
              </td>
              <td>
                <input
                  type="password"
                  onChange={(e) => handleInputChange(e, index, 'newPassword')}
                />
              </td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) => handleInputChange(e, index, 'role')}
                >
                  <option value="медсестра">Медсестра</option>
                  <option value="директор">Директор</option>
                  <option value="перевіряючий">Перевіряючий</option>
                  <option value="адміністратор">Адміністратор</option>
                </select>
              </td>
              <td>
                <button onClick={() => handleSubmit(index)}>Зберегти</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => {
        localStorage.removeItem('token');
        window.location.href = '/';
      }}>Вийти</button>
    </div>
  );
}

export default AdminForm;