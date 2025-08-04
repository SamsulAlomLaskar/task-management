"use client";

import { useState, useEffect } from "react";
import type { Task, TaskStatus } from "../types";
import "../styles/TaskForm.css"; // Restored CSS import
import {
  MenuItem,
  Select,
  type SelectChangeEvent,
  FormControl,
  InputLabel,
} from "@mui/material";

// Available status options with corresponding dot styles
const statusOptions: { value: TaskStatus; label: string; dotClass: string }[] =
  [
    { value: "Pending", label: "Pending", dotClass: "dot-pending" },
    { value: "In Progress", label: "In Progress", dotClass: "dot-progress" },
    { value: "Completed", label: "Completed", dotClass: "dot-completed" },
  ];

// EditTask component allows users to edit an existing task
const EditTask = ({
  task,
  onUpdate,
  onCancel,
}: {
  task: Task;
  onUpdate: (task: Task) => void;
  onCancel: () => void;
}) => {
  // Initialize form fields with the current task's values
  const [title, setTitle] = useState(task.title);
  const [desc, setDesc] = useState(task.description);
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [dueDate, setDueDate] = useState(task.dueDate || ""); // New state for due date

  // Effect to update local state if task prop changes (e.g., after an update from parent)
  // This useEffect is crucial for ensuring the form fields reflect the correct task
  // when a different task is selected for editing.
  useEffect(() => {
    setTitle(task.title);
    setDesc(task.description);
    setStatus(task.status);
    setDueDate(task.dueDate || "");
  }, [task]); // Dependency array includes 'task' to re-run when the task object changes

  // Trigger update when form is submitted
  const handleUpdate = () => {
    const updatedTask: Task = {
      ...task,
      title: title.trim(),
      description: desc.trim(),
      status,
      dueDate: dueDate || null,
    };

    // Sanitize currentElapsedTime to ensure it's a number before calculations
    const currentElapsedTime =
      typeof task.elapsedTime === "number" && !isNaN(task.elapsedTime)
        ? task.elapsedTime
        : 0;

    // Timer logic based on status change
    if (status === "In Progress" && task.status !== "In Progress") {
      // Starting timer or resuming from a non-in-progress state
      updatedTask.timerStartedAt = Date.now();
      updatedTask.pausedAt = null;
    } else if (status !== "In Progress" && task.status === "In Progress") {
      // Pausing timer
      if (task.timerStartedAt !== null) {
        updatedTask.elapsedTime =
          currentElapsedTime + (Date.now() - task.timerStartedAt);
      } else {
        updatedTask.elapsedTime = currentElapsedTime; // If timerStartedAt was null, just keep current elapsed
      }
      updatedTask.timerStartedAt = null;
      updatedTask.pausedAt = Date.now();
    } else if (status === "Completed" && task.status !== "Completed") {
      // If completed, stop timer and finalize elapsed time
      if (task.timerStartedAt !== null) {
        updatedTask.elapsedTime =
          currentElapsedTime + (Date.now() - task.timerStartedAt);
      } else {
        updatedTask.elapsedTime = currentElapsedTime; // If timerStartedAt was null, just keep current elapsed
      }
      updatedTask.timerStartedAt = null;
      updatedTask.pausedAt = null;
    }

    onUpdate(updatedTask);
  };

  // Update local state when the user selects a new status
  const handleStatusChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value as TaskStatus);
  };

  return (
    <div className="form-container">
      <h2>Edit Task</h2>
      {/* Title input */}
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Edit title"
      />
      {/* Description input */}
      <textarea
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        placeholder="Edit description"
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
      {/* Status dropdown using Material UI */}
      <FormControl fullWidth margin="normal">
        <InputLabel>Status</InputLabel>
        <Select value={status} onChange={handleStatusChange} label="Status">
          {statusOptions.map(({ value, label, dotClass }) => (
            <MenuItem key={value} value={value}>
              <div className="status-option">
                <span className={`status-dot ${dotClass}`} />
                <span>{label}</span>
              </div>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* Action buttons */}
      <div className="form-actions">
        <button className="cancel" onClick={onCancel}>
          Cancel
        </button>
        <button className="add" onClick={handleUpdate}>
          Update
        </button>
      </div>
    </div>
  );
};

export default EditTask;
