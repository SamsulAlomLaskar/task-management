import { useState, useEffect } from "react";
import { Task } from "./types";
import TaskList from "./components/TaskList";
import AddTask from "./components/AddTask";
import EditTask from "./components/EditTask";
import { ArrowLeft, Plus } from "lucide-react";
import "./styles/App.css";

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
      setTasks(JSON.parse(storedTasks));
    }
    setIsHydrated(true);
  }, []);

  // Save tasks to localStorage every time tasks state changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks, isHydrated]);

  // Handler for adding a new task
  const handleAddTask = (task: Task) => {
    setTasks((prev) => [...prev, task]);
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
          <TaskList tasks={tasks} onEdit={handleEdit} onDelete={handleDelete} />
          <button className="fab" onClick={() => setShowForm(true)}>
            <Plus />
          </button>
        </>
      )}
    </main>
  );
};

export default App;
