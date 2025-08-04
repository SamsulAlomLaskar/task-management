"use client";

import { useState, useEffect } from "react";
import type { Task, TaskStatus } from "./types";
import TaskList from "./components/TaskList";
import AddTask from "./components/AddTask";
import EditTask from "./components/EditTask";
import { ArrowLeft, Plus } from "lucide-react";
import "./styles/App.css"; // Restored CSS import

const App = () => {
  // State to store all tasks
  const [tasks, setTasks] = useState<Task[]>([]);
  // State to track the task currently being edited
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  // Controls whether the Add/Edit form is visible
  const [showForm, setShowForm] = useState(false);
  // Prevents localStorage from overwriting initial load
  const [isHydrated, setIsHydrated] = useState(false);

  // Load tasks from localStorage when component mounts
  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      const parsedTasks: Task[] = JSON.parse(storedTasks);
      // Sanitize elapsedTime, timerStartedAt, and pausedAt to ensure they are numbers or null
      const sanitizedTasks = parsedTasks.map((task) => ({
        ...task,
        elapsedTime:
          typeof task.elapsedTime === "number" && !isNaN(task.elapsedTime)
            ? task.elapsedTime
            : 0,
        timerStartedAt:
          typeof task.timerStartedAt === "number" && !isNaN(task.timerStartedAt)
            ? task.timerStartedAt
            : null,
        pausedAt:
          typeof task.pausedAt === "number" && !isNaN(task.pausedAt)
            ? task.pausedAt
            : null,
      }));
      setTasks(sanitizedTasks);
    }
    setIsHydrated(true);
  }, []);

  // Save tasks to localStorage every time tasks state changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks, isHydrated]);

  // Future task alert: checks for tasks due soon
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      tasks.forEach((task) => {
        if (task.dueDate && task.status !== "Completed") {
          const dueDateMs = new Date(task.dueDate).getTime();
          const timeUntilDue = dueDateMs - now;

          // Alert 1 hour before due date
          const alertThreshold = 60 * 60 * 1000; // 1 hour in milliseconds

          if (
            timeUntilDue > 0 &&
            timeUntilDue <= alertThreshold &&
            !task.alerted
          ) {
            // Mark task as alerted to prevent repeated alerts
            const updatedTasks = tasks.map((t) =>
              t.id === task.id ? { ...t, alerted: true } : t
            );
            setTasks(updatedTasks);
            alert(
              `Reminder: Task "${task.title}" is due soon! (${new Date(
                task.dueDate
              ).toLocaleString()})`
            );
          }
        }
      });
    }, 60 * 1000); // Check every minute

    return () => clearInterval(interval);
  }, [tasks]);

  // Handler for adding a new task (adds to top)
  const handleAddTask = (task: Task) => {
    setTasks((prev) => [task, ...prev]); // Add new task to the top
    setShowForm(false);
  };

  // Handler for updating an existing task
  const handleUpdateTask = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
    setEditingTask(null);
    setShowForm(false);
  };

  // Handler for deleting a task by ID
  const handleDelete = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  // Start editing a task
  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  // Cancel editing or adding a task
  const handleCancel = () => {
    setEditingTask(null);
    setShowForm(false);
  };

  // Handler to toggle timer status (play/pause)
  const handleToggleTimer = (id: string, newStatus: TaskStatus) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === id) {
          const updatedTask = { ...task, status: newStatus };
          // Sanitize currentElapsedTime to ensure it's a number before calculations
          const currentElapsedTime =
            typeof task.elapsedTime === "number" && !isNaN(task.elapsedTime)
              ? task.elapsedTime
              : 0;

          if (newStatus === "In Progress") {
            // Start or resume timer
            updatedTask.timerStartedAt = Date.now();
            updatedTask.pausedAt = null;
          } else {
            // Pausing or completing
            if (task.timerStartedAt !== null) {
              updatedTask.elapsedTime =
                currentElapsedTime + (Date.now() - task.timerStartedAt);
            } else {
              updatedTask.elapsedTime = currentElapsedTime; // If timerStartedAt was null, just keep current elapsed
            }
            updatedTask.timerStartedAt = null;
            updatedTask.pausedAt = Date.now();
          }
          return updatedTask;
        }
        return task;
      })
    );
  };

  return (
    <main className="main-wrapper">
      <header className="header">
        {showForm ? (
          // Show header with back button and appropriate form title
          <div>
            <button
              className="back-btn"
              onClick={handleCancel}
              title="Go back"
              aria-label="Go back"
            >
              <ArrowLeft />
            </button>
            {editingTask ? "Edit Task" : "Add Task"}
          </div>
        ) : (
          "TO-DO APP"
        )}
      </header>
      {showForm ? (
        // Conditionally render AddTask or EditTask component
        (() => {
          if (editingTask) {
            return (
              <EditTask
                key={editingTask.id} // Added key to force remount and state reset
                task={editingTask}
                onUpdate={handleUpdateTask}
                onCancel={handleCancel}
              />
            );
          } else {
            return <AddTask onAdd={handleAddTask} onCancel={handleCancel} />;
          }
        })()
      ) : (
        // Render task list and add button when no form is open
        <>
          <TaskList
            tasks={tasks}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleTimer={handleToggleTimer}
          />
          <button className="fab" onClick={() => setShowForm(true)}>
            <Plus />
          </button>
        </>
      )}
    </main>
  );
};

export default App;
