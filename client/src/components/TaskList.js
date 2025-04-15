import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskForm from '../pages/TaskForm';
import TaskFilters from '../pages/TaskFilter';

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/tasks', {
        headers: { 'x-auth-token': token },
      });
      setTasks(res.data);
      setFilteredTasks(res.data); // Initialize filteredTasks
    } catch (err) {
      console.error(err.response?.data?.msg || 'Error fetching tasks');
    }
  };

  // Load tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  // Filter tasks based on filters received from TaskFilter
  const handleFilterChange = (filters) => {
    let filtered = [...tasks];

    if (filters.priority) {
      filtered = filtered.filter((task) => task.priority === filters.priority);
    }

    if (filters.dueDate) {
      filtered = filtered.filter(
        (task) => new Date(task.dueDate) <= new Date(filters.dueDate)
      );
    }

    setFilteredTasks(filtered);
  };

  return (
    <div>
      <h2>Task List</h2>
      <TaskForm fetchTasks={fetchTasks} />
      <TaskFilters onFilter={handleFilterChange} />

      <ul>
        {filteredTasks.map((task) => (
          <li key={task._id}>
            <strong>{task.title}</strong> - {task.priority} -{' '}
            {new Date(task.dueDate).toLocaleDateString()} - {task.category}
          </li>
        ))}
      </ul>
    </div>
  );
}
