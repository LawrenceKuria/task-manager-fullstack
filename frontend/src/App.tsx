import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TaskLists from "./components/TaskListsScreen";
import CreateUpdateTaskListScreen from "./components/CreateUpdateTaskListScreen";
import TaskListScreen from "./components/TasksScreen";
import CreateUpdateTaskScreen from "./components/CreateUpdateTaskScreen";
import LoginScreen from "./components/LoginScreen";
import RegisterScreen from "./components/RegisterScreen";
import RequireAuth from "./components/RequireAuth";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/" element={<RequireAuth><TaskLists /></RequireAuth>} />
        <Route
          path="/new-task-list"
          element={
            <RequireAuth>
              <CreateUpdateTaskListScreen />
            </RequireAuth>
          }
        />
        <Route
          path="/edit-task-list/:listId"
          element={
            <RequireAuth>
              <CreateUpdateTaskListScreen />
            </RequireAuth>
          }
        />
        <Route
          path="/task-lists/:listId"
          element={
            <RequireAuth>
              <TaskListScreen />
            </RequireAuth>
          }
        />
        <Route
          path="/task-lists/:listId/new-task"
          element={
            <RequireAuth>
              <CreateUpdateTaskScreen />
            </RequireAuth>
          }
        />
        <Route
          path="/task-lists/:listId/edit-task/:taskId"
          element={
            <RequireAuth>
              <CreateUpdateTaskScreen />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
