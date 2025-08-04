"use client";

import { useState } from "react";
import type { Task, TaskStatus } from "../types";
import TaskItem from "./TaskItem";
import "../styles/TaskList.css"; // Restored CSS import
import { ChevronDown, ChevronUp, Search } from "lucide-react";

const TaskList = ({
  tasks,
  onEdit,
  onDelete,
  onToggleTimer,
}: {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleTimer: (id: string, newStatus: TaskStatus) => void; // New prop
}) => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const sections = ["In Progress", "Pending", "Completed"];

  // Toggle accordion section
  const handleAccordionToggle = (section: string) => {
    setExpanded((prev) => (prev === section ? null : section));
  };

  // Filter tasks based on search input
  const filteredTasks = tasks.filter((task) =>
    `${task.title} ${task.description}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="task-list-container">
      {/* Search bar */}
      <div className="search-wrapper">
        <Search className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search To-Do"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {/* If searching, show filtered results only */}
      {search.trim() ? (
        <div className="search-results">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleTimer={onToggleTimer} // Pass new prop
              />
            ))
          ) : (
            <p className="no-tasks">No matching tasks found</p>
          )}
        </div>
      ) : (
        // Otherwise group tasks by status
        sections.map((status) => {
          const sectionTasks = tasks.filter((task) => task.status === status);
          return (
            <div
              key={status}
              className={`accordion ${expanded === status ? "expanded" : ""}`}
            >
              <div
                className="accordion-header"
                onClick={() => handleAccordionToggle(status)}
              >
                <h3>
                  {status} ({sectionTasks.length})
                </h3>
                <span className="accordion-icon">
                  {expanded === status ? <ChevronUp /> : <ChevronDown />}
                </span>
              </div>
              {/* Section content */}
              {expanded === status && (
                <div className="accordion-body">
                  {sectionTasks.length > 0 ? (
                    sectionTasks.map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onToggleTimer={onToggleTimer} // Pass new prop
                      />
                    ))
                  ) : (
                    <p className="no-tasks">No tasks in this section</p>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default TaskList;
