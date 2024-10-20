import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UserCircle, Briefcase, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import { login } from '../api/api';

const SignIn: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await login(username, password);

      // Store the JWT token in localStorage
      localStorage.setItem('token', response.data.token);

      // Authenticate the user in your context and navigate
      authLogin(response.data.token, response.data.user);
      navigate('/');
    } catch (error) {
      console.error('Error signing in:', error);
      setError('Invalid username or password');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto bg-white rounded-lg overflow-hidden shadow-md border border-gray-200"
      >
        <div className="p-6">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Kirjaudu sisään Proccoon
          </h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Käyttäjänimi
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="input w-full"
                placeholder="Käyttäjänimi"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Salasana
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="input w-full"
                placeholder="Salasana"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full flex items-center justify-center"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Kirjaudu sisään
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default SignIn;
