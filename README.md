# task-management

This is a task management tool built with

# React + TypeScript + Vite

# 📝 React task-management App

A modern, minimalistic, and interactive To-Do list application built with **React + TypeScript** using **Vite**. It allows users to manage tasks with features like create, edit, delete, search, and categorize tasks by status — with full local persistence via `localStorage`.

---

## 🚀 Features

- ✅ Add tasks with title and description
- ✏️ Edit tasks including their status (Pending, In Progress, Completed)
- ❌ Delete tasks with confirmation
- 🔍 Live search through title and description
- 📂 Tasks grouped by status in expandable sections
- 🎨 Color-coded status indicators and task initials icon
- 💾 Persistent data using browser `localStorage`
- 📱 Fully responsive, simple UI

---

## 📦 Getting Started

Follow these steps to run the app locally:

### 1. Clone the repository

git clone https://github.com/your-username/todo-app.git
cd todo-app

### 2. Install dependencies

npm install

### 3. Start the development server

npm run dev
Then open http://localhost:5173 in your browser.

## 🛠 Tech Stack

React with TypeScript

Vite for fast development

CSS Modules for styling

Lucide Icons for modern SVG icons

Material UI (used only for Select in Edit Task form)

localStorage for persistent state management

📁 Folder Structure
src/
│
├── components/
│ ├── AddTask.tsx
│ ├── EditTask.tsx
│ ├── TaskItem.tsx
│ └── TaskList.tsx
│
├── styles/
│ ├── App.css
│ ├── TaskForm.css
│ ├── TaskItem.css
│ └── TaskList.css
│
├── types.ts # Shared Task and Status types
├── App.tsx # Root component
└── main.tsx

💡 Functionality Summary
AddTask: Allows the user to input a title and description. Input validation ensures empty tasks are not added.

EditTask: Uses a Select dropdown for status, and inputs for title/description. Preserves task ID and date.

TaskList: Displays tasks grouped by status with expandable accordions and live search. If a search is active, status grouping is bypassed.

TaskItem: Displays each task with icons, colored status, and date. Initial of task title shown as a circle icon.
