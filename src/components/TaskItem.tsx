import { Task } from "../types";
import "../styles/TaskItem.css";

const TaskItem = ({
  task,
  onEdit,
  onDelete,
}: {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}) => {
  // Utility to convert status to a CSS-friendly class name
  const getStatusClass = (status: string) =>
    status.toLowerCase().replace(" ", "-");

  // Utility to get the first character of the title
  const getInitial = (title: string) => title.charAt(0).toUpperCase();

  return (
    <div className={`task-card ${getStatusClass(task.status)}`}>
      {/* Header section with icon, title, and action buttons */}
      <div className="task-card-header">
        <div className={`task-icon ${getStatusClass(task.status)}`}>
          {getInitial(task.title)}
        </div>

        <h3 className="task-title">{task.title}</h3>

        <div className="task-actions">
          <button
            onClick={() => onEdit(task)}
            className="edit-btn"
            title="Edit Task"
          >
            🖉
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="delete-btn"
            title="Delete Task"
          >
            🗑
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
    </div>
  );
};

export default TaskItem;
