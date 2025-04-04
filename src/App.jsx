import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Task from './Task';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const BASE_URL = 'https://todo-backendd-hdpm.onrender.com/api/v1/tasks/';

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) setIsDarkMode(JSON.parse(savedMode));
    fetchTasks();
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(BASE_URL);
      setTasks(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks');
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingTask) {
        await axios.put(`${BASE_URL}${editingTask.id}/`, {
          title,
          completed: editingTask.completed,
        });
        setEditingTask(null);
      } else {
        await axios.post(`${BASE_URL}create/`, { title, completed: false });
      }
      setTitle('');
      fetchTasks();
    } catch (err) {
      setError('Failed to save task');
    }
    setLoading(false);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') return true;
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  return (
    <div className={`app ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="todo-container">
        <h1>To-Do List</h1>
        <button
          className="dark-mode-toggle"
          onClick={() => setIsDarkMode(!isDarkMode)}
        >
          {isDarkMode ? 'Light' : 'Dark'} Mode
        </button>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {editingTask ? 'Update' : 'Add'} Task
          </button>
          {editingTask && (
            <button
              type="button"
              onClick={() => {
                setEditingTask(null);
                setTitle('');
              }}
            >
              Cancel
            </button>
          )}
        </form>
        <div className="filter-buttons">
          <button
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'active' : ''}
          >
            All
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={filter === 'completed' ? 'active' : ''}
          >
            Completed
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={filter === 'pending' ? 'active' : ''}
          >
            Pending
          </button>
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {filteredTasks.map((task) => (
          <Task
            key={task.id}
            task={task}
            onToggleCompleted={async () => {
              try {
                await axios.put(`${BASE_URL}${task.id}/`, {
                  title: task.title,
                  completed: !task.completed,
                });
                fetchTasks();
              } catch (err) {
                setError('Failed to update task');
              }
            }}
            onEdit={() => {
              setEditingTask(task);
              setTitle(task.title);
            }}
            onDelete={async () => {
              try {
                await axios.delete(`${BASE_URL}${task.id}/`);
                fetchTasks();
              } catch (err) {
                setError('Failed to delete task');
              }
            }}
          />
        ))}
      </ul>
    </div>
  );
}

export default App;