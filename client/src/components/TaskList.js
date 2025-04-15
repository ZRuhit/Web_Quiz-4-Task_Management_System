import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskForm from '../pages/TaskForm';
import TaskFilters from '../pages/TaskFilter';

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);

  // Fetch all tasks
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

  // Filter handler
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

  // Delete a task
  const deleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        headers: { 'x-auth-token': token },
      });
      fetchTasks();
    } catch (err) {
      console.error(err.response?.data?.msg || 'Error deleting task');
    }
  };

  // Toggle complete/incomplete
  const toggleComplete = async (task) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/tasks/${task._id}`,
        { completed: !task.completed },
        {
          headers: { 'x-auth-token': token },
        }
      );
      fetchTasks();
    } catch (err) {
      console.error(err.response?.data?.msg || 'Error updating task');
    }
  };

  return (
    <div>
      <h2>Task List</h2>
      <TaskForm fetchTasks={fetchTasks} />
      <TaskFilters onFilter={handleFilterChange} />

      <ul>
        {filteredTasks.map((task) => (
          <li key={task._id} style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
            <strong>{task.title}</strong> - {task.priority} -{' '}
            {new Date(task.dueDate).toLocaleDateString()} - {task.category}
            <br />
            <button onClick={() => toggleComplete(task)}>
              {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
            </button>
            <button onClick={() => deleteTask(task._id)} style={{ marginLeft: '10px' }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
