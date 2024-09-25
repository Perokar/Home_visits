import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    login: '',
    fullName: '',
    region: '',
    cpmsd: '',
    ambulatoriya: '',
    password: '',
    role: 'медсестра'
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/register', formData);
      if ( response.status === 201 && response.data.message === 'Користувач успішно зареєстрований') {
        alert(response.data.message);
        navigate('/');
      }
    } catch (error) {
      console.error('Помилка реєстрації:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="login" value={formData.login} onChange={handleChange} placeholder="Логін" required />
      <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Повне ім'я" required />
      <input name="region" value={formData.region} onChange={handleChange} placeholder="Регіон" required />
      <input name="cpmsd" value={formData.cpmsd} onChange={handleChange} placeholder="ЦПМСД" required />
      <input name="ambulatoriya" value={formData.ambulatoriya} onChange={handleChange} placeholder="Амбулаторія" required />
      <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Пароль" required />
      <select name="role" value={formData.role} onChange={handleChange}>
        <option value="медсестра">Медсестра</option>
        <option value="директор">Директор</option>
        <option value="перевіряючий">Перевіряючий</option>
        <option value="адміністратор">Адміністратор</option>
      </select>
      <button type="submit">Зареєструватися</button>
    </form>
  );
};

export default RegisterForm;