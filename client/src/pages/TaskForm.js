import React, { useState } from 'react';
import axios from 'axios';

export default function TaskForm({ fetchTasks }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Low',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/tasks', formData, {
        headers: { 'x-auth-token': token },
      });
      setFormData({ title: '', description: '', dueDate: '', priority: 'Low' });
      fetchTasks(); // to refresh task list
    } catch (err) {
      console.error(err.response?.data?.msg || 'Error creating task');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
        required
      /><br />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        required
      ></textarea><br />
      <input
        type="date"
        name="dueDate"
        value={formData.dueDate}
        onChange={handleChange}
        required
      /><br />
      <select name="priority" value={formData.priority} onChange={handleChange}>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select><br />
      <button type="submit">Add Task</button>
    </form>
  );
}
