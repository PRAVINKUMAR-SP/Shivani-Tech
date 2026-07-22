import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import api from '../api';

const MasterDataPanel = ({ title, endpoint }) => {
  const [data, setData] = useState([]);
  const [newValue, setNewValue] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, [endpoint]);

  const fetchData = async () => {
    try {
      const response = await api.get(`/master-data/${endpoint}`);
      setData(response.data);
    } catch (err) {
      console.error(`Error fetching ${endpoint}`, err);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newValue.trim()) return;
    setError('');
    
    try {
      const response = await api.post(`/master-data/${endpoint}`, { name: newValue.trim() });
      setData([...data, response.data]);
      setNewValue('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add item. It may already exist.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/master-data/${endpoint}/${id}`);
      setData(data.filter(item => item.id !== id));
    } catch (err) {
      alert('Failed to delete item.');
    }
  };

  return (
    <div className="bg-surface border border-border rounded-2xl p-6">
      <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
      
      <form onSubmit={handleAdd} className="flex gap-3 mb-6">
        <input 
          type="text" 
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          placeholder={`Add new ${title.toLowerCase()}`}
          className="flex-1 bg-background border border-border rounded-xl px-4 py-2 text-white focus:border-primary focus:outline-none"
        />
        <button 
          type="submit"
          className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium transition-colors"
        >
          <Plus className="w-5 h-5" /> Add
        </button>
      </form>

      {error && <div className="text-danger text-sm mb-4">{error}</div>}

      <div className="space-y-2">
        {data.length === 0 ? (
          <div className="text-text-secondary text-center py-4 text-sm">No items configured yet.</div>
        ) : (
          data.map(item => (
            <div key={item.id} className="flex items-center justify-between bg-background border border-border rounded-xl p-3">
              <span className="text-white font-medium">{item.name}</span>
              <button 
                onClick={() => handleDelete(item.id)}
                className="text-text-secondary hover:text-danger transition-colors p-1"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MasterDataPanel;
