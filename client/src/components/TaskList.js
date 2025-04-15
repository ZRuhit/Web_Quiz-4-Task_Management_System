// src/pages/TaskList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskForm from './TaskForm';
import TaskFilters from './TaskFilter';

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/tasks', {
        headers: { 'x-auth-token': token },
      });
      setTasks(res.data);
      setFilteredTasks(res.data);
    } catch (err) {
      console.error(err.response?.data?.msg || 'Error fetching tasks');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleFilterChange = (filters) => {
    let filtered = [...tasks];

    if (filters.priority) {
      filtered = filtered.filter((task) => task.priority === filters.priority);
    }
    if (filters.dueDate) {
      filtered = filtered.filter((task) => new Date(task.dueDate) <= new Date(filters.dueDate));
    }

    setFilteredTasks(filtered);
  };

  const toggleCompletion = async (taskId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/tasks/${taskId}/completed`,
        { isCompleted: !currentStatus },
        {
          headers: { 'x-auth-token': token },
        }
      );
      fetchTasks(); // refresh after toggle
    } catch (err) {
      console.error(err.response?.data?.msg || 'Error updating completion');
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        headers: { 'x-auth-token': token },
      });
      fetchTasks(); // refresh after delete
    } catch (err) {
      console.error(err.response?.data?.msg || 'Error deleting task');
    }
  };

  return (
    <div>
      <h2>Task List</h2>
      <TaskForm fetchTasks={fetchTasks} />
      <TaskFilters onFilter={handleFilterChange} />
      <ul>
        {filteredTasks.map((task) => (
          <li key={task._id} style={{ marginBottom: '10px' }}>
            <strong style={{ textDecoration: task.isCompleted ? 'line-through' : 'none' }}>
              {task.title}
            </strong>{' '}
            - {task.priority} - {task.category} -{' '}
            {new Date(task.dueDate).toLocaleDateString()}
            <br />
            <button onClick={() => toggleCompletion(task._id, task.isCompleted)}>
              {task.isCompleted ? 'Mark Incomplete' : 'Mark Complete'}
            </button>{' '}
            <button onClick={() => deleteTask(task._id)} style={{ color: 'red' }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
