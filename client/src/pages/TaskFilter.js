import React, { useState } from 'react';

export default function TaskFilters({ onFilter }) {
  const [search, setSearch] = useState('');
  const [priority, setPriority] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleFilter = () => {
    onFilter({ search, priority, dueDate });
  };

  return (
    <div className="filter-container">
      <input
        type="text"
        placeholder="Search by title"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="">All Priorities</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <button onClick={handleFilter}>Apply Filters</button>
    </div>
  );
}
