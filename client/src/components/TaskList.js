import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskForm from './TaskForm';

export default function TaskList() {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/tasks', {
        headers: { 'x-auth-token': token },
      });
      setTasks(res.data);
    } catch (err) {
      console.error(err.response?.data?.msg || 'Error fetching tasks');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div>
      <h2>Task List</h2>
      <TaskForm fetchTasks={fetchTasks} />
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            <strong>{task.title}</strong> - {task.priority} - {new Date(task.dueDate).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
