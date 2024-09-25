import React, { useState, useEffect } from 'react';
import axios from 'axios';

function NurseForm() {
  const [activeTab, setActiveTab] = useState('add');
  const [clientData, setClientData] = useState({
    Type: '',
    fullName: '',
    BirthDate: '',
    Locality: '',
    Region: '',
    VPO: false,
    declaration_parents: '',
    declaration: ''
  });
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get('/clients', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setClients(response.data);
    } catch (error) {
      console.error('Помилка при отриманні клієнтів:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setClientData({
      ...clientData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/clients', clientData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Клієнт успішно збережений');
      setClientData({
        Type: '',
        fullName: '',
        BirthDate: '',
        Locality: '',
        Region: '',
        VPO: false,
        declaration_parents: '',
        declaration: ''
      });
    } catch (error) {
      console.error('Помилка при збереженні клієнта:', error);
    }
  };

  const handleClientSelect = (e) => {
    const client = clients.find(c => c.fullName === e.target.value);
    setSelectedClient(client);
    setClientData(client);
  };

  return (
    <div>
      <button onClick={() => setActiveTab('add')}>Додати клієнта</button>
      <button onClick={() => setActiveTab('edit')}>Редагувати клієнта</button>

      {activeTab === 'add' && (
        <form onSubmit={handleSubmit}>
          {/* Поля форми для додавання клієнта */}
          <button type="submit">Зберегти</button>
        </form>
      )}

      {activeTab === 'edit' && (
        <div>
          <select onChange={handleClientSelect}>
            <option value="">Виберіть клієнта</option>
            {clients.map(client => (
              <option key={client._id} value={client.fullName}>{client.fullName}</option>
            ))}
          </select>
          {selectedClient && (
            <form onSubmit={handleSubmit}>
              {/* Поля форми для редагування клієнта */}
              <button type="submit">Редагувати</button>
              <button type="button">Додати візит</button>
            </form>
          )}
        </div>
      )}
      <button onClick={() => {
        localStorage.removeItem('token');
        window.location.href = '/';
      }}>Вийти</button>
    </div>
  );
}

export default NurseForm;