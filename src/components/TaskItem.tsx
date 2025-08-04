"use client";

import { useState, useEffect } from "react";
import type { Task, TaskStatus } from "../types";
import "../styles/TaskItem.css"; // Restored CSS import
import { Play, Pause, Trash2, Edit } from "lucide-react"; // Import icons

const TaskItem = ({
  task,
  onEdit,
  onDelete,
  onToggleTimer,
}: {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleTimer: (id: string, newStatus: TaskStatus) => void; // New prop for timer control
}) => {
  // Utility to convert status to a CSS-friendly class name
  const getStatusClass = (status: string) =>
    status.toLowerCase().replace(" ", "-");
  // Utility to get the first character of the title
  const getInitial = (title: string) => title.charAt(0).toUpperCase();

  const [displayTime, setDisplayTime] = useState(task.elapsedTime);
  const [isTimerRunning, setIsTimerRunning] = useState(
    task.status === "In Progress" && task.timerStartedAt !== null
  );

  // Effect to update the displayed timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (task.status === "In Progress" && task.timerStartedAt !== null) {
      setIsTimerRunning(true);
      interval = setInterval(() => {
        // Ensure task.timerStartedAt is not null before calculation
        if (task.timerStartedAt !== null) {
          setDisplayTime(task.elapsedTime + (Date.now() - task.timerStartedAt));
        }
      }, 1000); // Update every second
    } else {
      setIsTimerRunning(false);
      setDisplayTime(task.elapsedTime); // Ensure display time is updated when paused/stopped
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [task.status, task.timerStartedAt, task.elapsedTime]);

  // Formats milliseconds into HH:MM:SS
  const formatTime = (ms: number) => {
    // Ensure ms is a valid number before calculations
    if (typeof ms !== "number" || isNaN(ms)) {
      return "00:00:00";
    }
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Handles delete with confirmation
  const handleDeleteClick = () => {
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      onDelete(task.id);
    }
  };

  // Handles toggling the timer (play/pause)
  const handleToggleTimerClick = () => {
    if (task.status === "In Progress") {
      // If currently in progress, pause it
      onToggleTimer(task.id, "Pending"); // Change status to Pending to pause
    } else {
      // If not in progress, start/resume it
      onToggleTimer(task.id, "In Progress"); // Change status to In Progress to start
    }
  };

  return (
    <div className={`task-card ${getStatusClass(task.status)}`}>
      {/* Header section with icon, title, and action buttons */}
      <div className="task-card-header">
        <div className={`task-icon ${getStatusClass(task.status)}`}>
          {getInitial(task.title)}
        </div>
        <h3 className="task-title">{task.title}</h3>
        <div className="task-actions">
          {task.status !== "Completed" && ( // Only show timer controls if not completed
            <button
              onClick={handleToggleTimerClick}
              className="timer-btn"
              title={isTimerRunning ? "Pause Timer" : "Start/Resume Timer"}
            >
              {isTimerRunning ? <Pause size={18} /> : <Play size={18} />}
            </button>
          )}
          <button
            onClick={() => onEdit(task)}
            className="edit-btn"
            title="Edit Task"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={handleDeleteClick}
            className="delete-btn"
            title="Delete Task"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      {/* Task description */}
      <p className="task-desc">{task.description}</p>
      {/* Footer with date and status */}
      <div className="task-footer">
        <span className="task-date">{task.date}</span>
        <span className="status-option">
          <span className={`status-dot dot-${getStatusClass(task.status)}`} />
          {task.status}
        </span>
      </div>
      {/* New: Display timer if not completed */}
      {task.status !== "Completed" && (
        <div className="task-timer">Time Spent: {formatTime(displayTime)}</div>
      )}
      {/* New: Display due date if set */}
      {task.dueDate && (
        <div className="task-due-date">
          Due: {new Date(task.dueDate).toLocaleString()}
        </div>
      )}
    </div>
  );
};

export default TaskItem;
