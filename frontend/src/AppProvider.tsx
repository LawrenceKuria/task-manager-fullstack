import React, { createContext, useContext, useReducer, useEffect } from "react";
import api from "./axiosInstance";
import TaskList from "./domain/TaskList";
import Task from "./domain/Task";
import { useAuth } from "./AuthProvider";

interface AppState {
  taskLists: TaskList[];
  tasks: { [taskListId: string]: Task[] };
}

// 🔹 Action type constants
const FETCH_TASKLISTS = "FETCH_TASKLISTS";
const GET_TASKLIST = "GET_TASKLIST";
const CREATE_TASKLIST = "CREATE_TASKLIST";
const UPDATE_TASKLIST = "UPDATE_TASKLIST";
const DELETE_TASKLIST = "DELETE_TASKLIST";
const FETCH_TASKS = "FETCH_TASKS";
const CREATE_TASK = "CREATE_TASK";
const GET_TASK = "GET_TASK";
const UPDATE_TASK = "UPDATE_TASK";
const DELETE_TASK = "DELETE_TASK";

// 🔹 Action types
type Action =
  | { type: typeof FETCH_TASKLISTS; payload: TaskList[] }
  | { type: typeof GET_TASKLIST; payload: TaskList }
  | { type: typeof CREATE_TASKLIST; payload: TaskList }
  | { type: typeof UPDATE_TASKLIST; payload: TaskList }
  | { type: typeof DELETE_TASKLIST; payload: string }
  | { type: typeof FETCH_TASKS; payload: { taskListId: string; tasks: Task[] } }
  | { type: typeof CREATE_TASK; payload: { taskListId: string; task: Task } }
  | { type: typeof GET_TASK; payload: { taskListId: string; task: Task } }
  | {
      type: typeof UPDATE_TASK;
      payload: { taskListId: string; taskId: string; task: Task };
    }
  | { type: typeof DELETE_TASK; payload: { taskListId: string; taskId: string } };

// 🔹 Reducer function
const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case FETCH_TASKLISTS:
      return { ...state, taskLists: action.payload };
    case GET_TASKLIST:
      return {
        ...state,
        taskLists: state.taskLists.some((wl) => wl.id === action.payload.id)
          ? state.taskLists.map((wl) =>
              wl.id === action.payload.id ? action.payload : wl
            )
          : [...state.taskLists, action.payload],
      };
    case CREATE_TASKLIST:
      return { ...state, taskLists: [...state.taskLists, action.payload] };
    case UPDATE_TASKLIST:
      return {
        ...state,
        taskLists: state.taskLists.map((wl) =>
          wl.id === action.payload.id ? action.payload : wl
        ),
      };
    case DELETE_TASKLIST:
      return {
        ...state,
        taskLists: state.taskLists.filter((wl) => wl.id !== action.payload),
      };
    case FETCH_TASKS:
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.payload.taskListId]: action.payload.tasks,
        },
      };
    case CREATE_TASK:
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.payload.taskListId]: [
            ...(state.tasks[action.payload.taskListId] || []),
            action.payload.task,
          ],
        },
      };
    case GET_TASK: {
      const existingTasks = state.tasks[action.payload.taskListId] || [];
      const taskExists = existingTasks.some(
        (task) => task.id === action.payload.task.id
      );
      const updatedTasks = taskExists
        ? existingTasks.map((task) =>
            task.id === action.payload.task.id ? action.payload.task : task
          )
        : [...existingTasks, action.payload.task];
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.payload.taskListId]: updatedTasks,
        },
      };
    }
    case UPDATE_TASK:
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.payload.taskListId]: state.tasks[action.payload.taskListId].map(
            (task) =>
              task.id === action.payload.taskId ? action.payload.task : task
          ),
        },
      };
    case DELETE_TASK:
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.payload.taskListId]: state.tasks[action.payload.taskListId].filter(
            (task) => task.id !== action.payload.taskId
          ),
        },
      };
    default:
      return state;
  }
};

// 🔹 Initial state
const initialState: AppState = {
  taskLists: [],
  tasks: {},
};

interface AppContextType {
  state: AppState;
  api: {
    fetchTaskLists: () => Promise<void>;
    getTaskList: (id: string) => Promise<void>;
    createTaskList: (taskList: Omit<TaskList, "id">) => Promise<void>;
    updateTaskList: (id: string, taskList: TaskList) => Promise<void>;
    deleteTaskList: (id: string) => Promise<void>;
    fetchTasks: (taskListId: string) => Promise<void>;
    createTask: (
      taskListId: string,
      task: Omit<Task, "id" | "taskListId">
    ) => Promise<void>;
    getTask: (taskListId: string, taskId: string) => Promise<void>;
    updateTask: (
      taskListId: string,
      taskId: string,
      task: Task
    ) => Promise<void>;
    deleteTask: (taskListId: string, taskId: string) => Promise<void>;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      api.fetchTaskLists?.();
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  }, [token]);

  const apiCalls: AppContextType["api"] = {
    fetchTaskLists: async () => {
      const response = await api.get<TaskList[]>("/api/task-lists");
      dispatch({ type: FETCH_TASKLISTS, payload: response.data });
    },
    getTaskList: async (id: string) => {
      const response = await api.get<TaskList>(`/api/task-lists/${id}`);
      dispatch({ type: GET_TASKLIST, payload: response.data });
    },
    createTaskList: async (taskList) => {
      const response = await api.post<TaskList>("/api/task-lists", taskList);
      dispatch({ type: CREATE_TASKLIST, payload: response.data });
    },
    getTask: async (taskListId, taskId) => {
      const response = await api.get<Task>(
        `/api/task-lists/${taskListId}/tasks/${taskId}`
      );
      dispatch({
        type: GET_TASK,
        payload: { taskListId, task: response.data },
      });
    },
    updateTaskList: async (id, taskList) => {
      const response = await api.put<TaskList>(`/api/task-lists/${id}`, taskList);
      dispatch({ type: UPDATE_TASKLIST, payload: response.data });
    },
    deleteTaskList: async (id) => {
      await api.delete(`/api/task-lists/${id}`);
      dispatch({ type: DELETE_TASKLIST, payload: id });
    },
    fetchTasks: async (taskListId) => {
      const response = await api.get<Task[]>(`/api/task-lists/${taskListId}/tasks`);
      dispatch({
        type: FETCH_TASKS,
        payload: { taskListId, tasks: response.data },
      });
    },
    createTask: async (taskListId, task) => {
      const response = await api.post<Task>(
        `/api/task-lists/${taskListId}/tasks`,
        task
      );
      dispatch({
        type: CREATE_TASK,
        payload: { taskListId, task: response.data },
      });
    },
    updateTask: async (taskListId, taskId, task) => {
      const response = await api.put<Task>(
        `/api/task-lists/${taskListId}/tasks/${taskId}`,
        task
      );
      dispatch({
        type: UPDATE_TASK,
        payload: { taskListId, taskId, task: response.data },
      });
    },
    deleteTask: async (taskListId, taskId) => {
      await api.delete(`/api/task-lists/${taskListId}/tasks/${taskId}`);
      dispatch({ type: DELETE_TASK, payload: { taskListId, taskId } });
    },
  };

  return (
    <AppContext.Provider value={{ state, api: apiCalls }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
