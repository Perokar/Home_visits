import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', { login, password });
      localStorage.setItem('token', response.data.token);
      console.log(typeof(response.data));
      if (response.data.role === 'медсестра') {
        navigate('/nurse');
      } else if (response.data.role === 'адміністратор') {
        navigate('/admin');
      }
    } catch (error) {
      console.log(error);
      setError(error.response.data.message);
    }
  };
  // Перехід на сторінку реєстрації
  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={login}
        onChange={(e) => setLogin(e.target.value)}
        placeholder="Логін"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Пароль"
        required
      />
      <button type="submit">Логін</button>
      <button onClick={handleRegister}>Реєстрація</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}

export default LoginForm;