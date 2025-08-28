import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from "../context/userContext";
import Cookies from "js-cookie";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Activity } from 'lucide-react';
import { BACKEND_URL } from '@/constant';

const HealthMetricsProfile = () => {
  const { user } = useContext(UserContext);
  const [formData, setFormData] = useState({
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    weight: '',
    sugarLevel: '',
    oxygenLevel: '',
    lastUpdated: null
  });
  
  const [metricsHistory, setMetricsHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const fetchHealthMetrics = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Authentication token not found");

      const email = user.email;
      
      const response = await fetch(`${BACKEND_URL}/patient/health/metrics/${user.email}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch health metrics');
      }
      
      const data = await response.json();
      
      setFormData({
        bloodPressureSystolic: data.currentMetrics?.bloodPressure?.systolic || '',
        bloodPressureDiastolic: data.currentMetrics?.bloodPressure?.diastolic || '',
        weight: data.currentMetrics?.weight || '',
        sugarLevel: data.currentMetrics?.sugarLevel || '',
        oxygenLevel: data.currentMetrics?.oxygenLevel || '',
        lastUpdated: data.currentMetrics?.timestamp || null
      });

      setMetricsHistory(data.history || []);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to fetch health metrics');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchHealthMetrics();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
  
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("Authentication token not found");
  
      const response = await fetch(`${BACKEND_URL}/patient/health/metrics/${user.email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          bloodPressure: {
            systolic: parseInt(formData.bloodPressureSystolic),
            diastolic: parseInt(formData.bloodPressureDiastolic)
          },
          weight: parseFloat(formData.weight),
          sugarLevel: parseFloat(formData.sugarLevel),
          oxygenLevel: parseInt(formData.oxygenLevel)
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update metrics');
      }
  
      const data = await response.json();
      
      await fetchHealthMetrics(); // Refresh data
      setSuccess('Health metrics updated successfully');
      setIsEditing(false);
  
    } catch (error) {
      console.error('Update error:', error);
      setError(error.message || 'Failed to update health metrics');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-12">
            <div className="flex items-center justify-center mb-6">
              <Activity className="w-16 h-16 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white text-center mb-2">Health Metrics</h1>
            <p className="text-blue-100 text-center">{user.name}</p>
            {formData.lastUpdated && (
              <p className="text-blue-100 text-center mt-2">
                Last updated: {new Date(formData.lastUpdated).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Metrics Display/Form */}
          <div className="p-8">
            {!isEditing ? (
              // View Mode
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Blood Pressure</h3>
                    <p className="text-2xl text-blue-600">
                      {formData.bloodPressureSystolic}/{formData.bloodPressureDiastolic} mmHg
                    </p>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Weight</h3>
                    <p className="text-2xl text-blue-600">{formData.weight} kg</p>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Sugar Level</h3>
                    <p className="text-2xl text-blue-600">{formData.sugarLevel} mg/dL</p>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Oxygen Level</h3>
                    <p className="text-2xl text-blue-600">{formData.oxygenLevel}%</p>
                  </div>
                </div>

                <button 
                  onClick={() => setIsEditing(true)}
                  className="w-full mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition duration-200"
                >
                  Update Metrics
                </button>

                {/* Metrics History Chart */}
                {metricsHistory.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">History</h3>
                    <div className="h-64 w-full">
                      <LineChart
                        width={800}
                        height={240}
                        data={metricsHistory.map(m => ({
                          date: new Date(m.timestamp).toLocaleDateString(),
                          weight: m.weight,
                          sugar: m.sugarLevel,
                          oxygen: m.oxygenLevel,
                          systolic: m.bloodPressure.systolic,
                          diastolic: m.bloodPressure.diastolic
                        }))}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="weight" stroke="#3B82F6" />
                        <Line type="monotone" dataKey="sugar" stroke="#10B981" />
                        <Line type="monotone" dataKey="oxygen" stroke="#6366F1" />
                      </LineChart>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Edit Mode
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-2">
                      Blood Pressure (Systolic)
                    </label>
                    <input
                      name="bloodPressureSystolic"
                      type="number"
                      value={formData.bloodPressureSystolic}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter systolic pressure"
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-2">
                      Blood Pressure (Diastolic)
                    </label>
                    <input
                      name="bloodPressureDiastolic"
                      type="number"
                      value={formData.bloodPressureDiastolic}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter diastolic pressure"
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-2">
                      Weight (kg)
                    </label>
                    <input
                      name="weight"
                      type="number"
                      step="0.1"
                      value={formData.weight}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter weight"
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-2">
                      Sugar Level (mg/dL)
                    </label>
                    <input
                      name="sugarLevel"
                      type="number"
                      step="0.1"
                      value={formData.sugarLevel}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter sugar level"
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-2">
                      Oxygen Level (%)
                    </label>
                    <input
                      name="oxygenLevel"
                      type="number"
                      value={formData.oxygenLevel}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter oxygen level"
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-xl">
                    {error}
                  </div>
                )}
                
                {success && (
                  <div className="p-4 bg-green-50 text-green-600 rounded-xl">
                    {success}
                  </div>
                )}

                <div className="flex space-x-4">
                  <button 
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition duration-200"
                  >
                    Save Changes
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-300 transition duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthMetricsProfile;