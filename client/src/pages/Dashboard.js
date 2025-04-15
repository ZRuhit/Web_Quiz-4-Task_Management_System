import React from 'react';
import TaskList from '../components/TaskList';

const Dashboard = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to your Task Manager Dashboard</p>
      <TaskList />
    </div>
  );
};

export default Dashboard;