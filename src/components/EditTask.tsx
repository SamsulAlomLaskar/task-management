import { useState } from "react";
import { Task, TaskStatus } from "../types";
import "../styles/TaskForm.css";
import {
  MenuItem,
  Select,
  SelectChangeEvent,
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

  // Trigger update when form is submitted
  const handleUpdate = () => {
    onUpdate({
      ...task,
      title: title.trim(),
      description: desc.trim(),
      status,
    });
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
