import express, { Request, Response } from 'express';
import { createTodo, deleteTodo, fetchAllTodos, fetchTodo, patchTodo } from '../controller/todoController';
const router = express.Router();

// --- GET TODO
router.get("/", fetchAllTodos);

// --- GET TODOS BY ID
router.get("/:id", fetchTodo);

// --- CREATE/POST TODO
router.post("/", createTodo);

// --- UPDATE/PATCH TODO
router.patch("/:id", patchTodo);

// --- DELETE TODO
router.delete("/:id", deleteTodo);

export default router;