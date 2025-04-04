import React from 'react';

function Task({ task, onToggleCompleted, onEdit, onDelete }) {
  return (
    <li>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={onToggleCompleted}
      />
      <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
        {task.title}
      </span>
      <button onClick={onEdit}>Edit</button>
      <button className="delete-button" onClick={onDelete}>Delete</button>
    </li>
  );
}

export default Task;