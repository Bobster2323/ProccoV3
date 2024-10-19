import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { submitServiceRequest } from '../api/api';
import { useAuth } from '../contexts/AuthContext';

const CreateServiceRequest: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [budget, setBudget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to submit a service request');
      return;
    }
    setIsSubmitting(true);
    setError('');
    try {
      const response = await submitServiceRequest({
        user_id: user.id,
        title,
        description,
        category,
        budget,
        deadline,
        location,
      });
      console.log('Service request submitted:', response.data);
      navigate('/buyer-dashboard');
    } catch (error) {
      console.error('Error submitting service request:', error);
      setError('Error submitting service request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto bg-white rounded-lg overflow-hidden shadow-md border border-gray-200"
      >
        <div className="p-6">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Luo uusi palvelupyyntö
          </h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Otsikko
              </label>
              <input
                id="title"
                type="text"
                required
                className="input w-full"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Kuvaus
              </label>
              <textarea
                id="description"
                required
                className="input w-full h-32"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Kategoria
              </label>
              <input
                id="category"
                type="text"
                required
                className="input w-full"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
                Budjetti
              </label>
              <input
                id="budget"
                type="text"
                required
                className="input w-full"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
                Määräaika
              </label>
              <input
                id="deadline"
                type="date"
                required
                className="input w-full"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Sijainti
              </label>
              <input
                id="location"
                type="text"
                required
                className="input w-full"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full flex items-center justify-center"
            >
              {isSubmitting ? (
                <Loader className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <ArrowRight className="w-5 h-5 mr-2" />
              )}
              {isSubmitting ? 'Lähetetään...' : 'Lähetä palvelupyyntö'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateServiceRequest;
