import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAdminStore from '../store/useAdminStore';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const setToken = useAdminStore(state => state.setToken);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3001/api/admin/login', { username, password });
      setToken(res.data.token);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'خطا در ورود');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">ورود ادمین</h2>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <input type="text" placeholder="نام کاربری" value={username} onChange={e => setUsername(e.target.value)}
          className="w-full border rounded p-2 mb-4" required />
        <input type="password" placeholder="رمز عبور" value={password} onChange={e => setPassword(e.target.value)}
          className="w-full border rounded p-2 mb-4" required />
        <button type="submit" className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-900 transition">ورود</button>
      </form>
    </div>
  );
}