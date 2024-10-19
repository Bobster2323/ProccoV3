import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle, Briefcase, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { register } from '../api/api';
import { useAuth } from '../contexts/AuthContext';

const SignUp: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      console.log('Attempting to register user:', { username, role });
      const response = await register(username, password, role);
      console.log('Registration successful:', response.data);
      
      // Assuming the backend returns a token and user object upon successful registration
      login(response.data.token, response.data.user);
      navigate('/');
    } catch (error: any) {
      console.error('Registration error:', error);
      setError(error.response?.data?.error || 'An error occurred during registration');
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
            Rekisteröidy Proccoon
          </h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSignUp} className="space-y-4">
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

            <div className="flex items-center justify-center space-x-4">
              <button
                type="button"
                className={`flex-1 py-2 px-4 rounded-md focus:outline-none transition-colors ${
                  role === 'buyer'
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => setRole('buyer')}
              >
                <UserCircle className="inline-block mr-2" />
                Ostaja
              </button>
              <button
                type="button"
                className={`flex-1 py-2 px-4 rounded-md focus:outline-none transition-colors ${
                  role === 'seller'
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => setRole('seller')}
              >
                <Briefcase className="inline-block mr-2" />
                Myyjä
              </button>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full flex items-center justify-center"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Rekisteröidy
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;
