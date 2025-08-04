"use client";

import { useState } from "react";
import type { Task } from "../types";
import "../styles/TaskForm.css"; // Restored CSS import

// AddTask component: handles creation of new tasks
const AddTask = ({
  onAdd,
  onCancel,
}: {
  onAdd: (task: Task) => void;
  onCancel: () => void;
}) => {
  // Local state for task input values
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [dueDate, setDueDate] = useState(""); // New state for due date
  const [error, setError] = useState("");

  // Handle form submission
  const handleAdd = () => {
    // Validate input fields
    if (!title.trim() || !desc.trim()) {
      setError("Title and description cannot be empty.");
      return;
    }
    // Create a new task object
    const newTask: Task = {
      id: crypto.randomUUID(), // Generate unique ID
      title: title.trim(),
      description: desc.trim(),
      status: "Pending", // Default status
      date: new Date().toDateString(), // Current date
      dueDate: dueDate || null, // Use dueDate if provided, otherwise null
      timerStartedAt: null, // Initialize timer state
      pausedAt: null,
      elapsedTime: 0,
    };
    // Trigger the parent handler to add the task
    onAdd(newTask);
    // Clear form fields and error after successful submission
    setTitle("");
    setDesc("");
    setDueDate(""); // Clear due date
    setError("");
  };

  return (
    <div className="form-container">
      <h2>Add Task</h2>
      {/* Title Input */}
      <input
        placeholder="Enter the title"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          if (error) setError(""); // Clear error when user starts typing
        }}
      />
      {/* Description Input */}
      <textarea
        placeholder="Enter the description"
        value={desc}
        onChange={(e) => {
          setDesc(e.target.value);
          if (error) setError(""); // Clear error on change
        }}
      />
      {/* Due Date Input */}
      <div>
        <label htmlFor="dueDate">Due Date & Time (Optional)</label>
        <input
          id="dueDate"
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>
      {/* Error Message */}
      {error && <p className="form-error">{error}</p>}
      {/* Action Buttons */}
      <div className="form-actions">
        <button className="cancel" onClick={onCancel}>
          Cancel
        </button>
        <button className="add" onClick={handleAdd}>
          Add
        </button>
      </div>
    </div>
  );
};

export default AddTask;
