import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export const Login: React.FC = () => {
  const [email, setEmail]       = useState('admin@test.com');
  const [password, setPassword] = useState('Admin1234!');
  const [error, setError]       = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post<{ token: string }>('/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/candidates');
    } catch {
      setError('Identifiants invalides');
    }
  };

  return (
    <main>
      <h1>Connexion</h1>
      {error && <p role="alert">{error}</p>}
      <form onSubmit={handleLogin} aria-label="Formulaire de connexion">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <label htmlFor="password">Mot de passe</label>
        <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">Se connecter</button>
      </form>
    </main>
  );
};