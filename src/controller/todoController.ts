import { Request, Response } from "express";
import { Todo } from "../models/Todos";
import { db } from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";

// FETCH ALL TODOS
export const fetchAllTodos = async (req: Request, res: Response) => {
	try {
		const [rows] = await db.query<RowDataPacket[]>("SELECT * FROM todos");
		res.json(rows);
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Unknown error";
		res.status(500).json({ error: message });
	}
};

// TODO CONTROLLERS - NEW W. SQL 

// FETCH TODO
export const fetchTodo = async (req: Request, res: Response) => {
	const id = req.params.id;

	try {
		const sql = `
      SELECT * FROM todos 
      WHERE id = ?
    `;
		const [rows] = await db.query<RowDataPacket[]>(sql, [id]);
		const todo = rows[0];
		if (!todo) {
			res.status(404).json({ message: "Todo not found" });
			return;
		}
		res.json(todo);
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Unknown error";
		res.status(500).json({ error: message });
	}
};

// CREATE TODO
export const createTodo = async (req: Request, res: Response) => {
	const content = req.body.content;
	if (content === undefined) {
		res.status(400).json({ error: "Content is required" });
		return;
	}

	try {
		const sql = `
      INSERT INTO todos (content)
      VALUES (?)
    `;
		const [result] = await db.query<ResultSetHeader>(sql, [content]);
		res.status(201).json({ message: "Todo created", id: result.insertId });
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Unknown error";
		res.status(500).json({ error: message });
	}
};

// UPDATE TODO
export const patchTodo = async (req: Request, res: Response) => {
	const id = req.params.id;
	const { content, done } = req.body; // Destructur objektet från request body

	if (content === undefined || done === undefined) {
		res.status(400).json({ error: "Content and Done are required" });
		return;
	}

	try {
		const sql = `
      UPDATE todos
      SET content = ?, done = ?
      WHERE id = ?
    `;
		const [result] = await db.query<ResultSetHeader>(sql, [content, done, id]);

		if (result.affectedRows === 0) {
			res.status(404).json({ message: "Todo not found" });
			return;
		}

		res.json({ message: "Todo updated", data: { id, content, done } });
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Unknown error";
		res.status(500).json({ error: message });
	}
};

// DELETE TODO
export const deleteTodo = async (req: Request, res: Response) => {
	const id = req.params.id;

	try {
		const sql = `
      DELETE FROM todos
      WHERE id = ?
    `;
		const [result] = await db.query<ResultSetHeader>(sql, [id]);
		if (result.affectedRows === 0) {
			res.status(404).json({ message: "Todo not found" });
			return;
		}
		res.json({ message: "Todo deleted" });
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Unknown error";
		res.status(500).json({ error: message });
	}
};

// OLD CODE - 

// const todos: Todo[] = [
//   new Todo("slänga sopor"),
//   new Todo("chilla"),
//   new Todo("jobba"),
//   new Todo("festa"),
//   new Todo("sova"),
//   new Todo("sova länge")
// ];

// export const fetchAllTodos = (req: Request, res: Response) => {
//   const search = req.query.search;
//   const sort = req.query.sort;
//   let filteredTodos = todos;

//   try {
//     if (search) {
//       filteredTodos = filteredTodos.filter((t) => t.content.includes(search.toString()));
//     }
//     if (sort && sort === "asc") {
//       filteredTodos = filteredTodos.sort((a, b) => a.content.localeCompare(b.content));
//     }
//     if (sort && sort === "desc") {
//       filteredTodos = filteredTodos.sort((a, b) => b.content.localeCompare(a.content));
//     }
//     res.json(filteredTodos);
//   } catch (error: unknown) {
//     const message = error instanceof Error ? error.message : "Unknown error";
//     res.status(500).json({ error: message });
//   }
// };

// export const fetchTodo = (req: Request, res: Response) => {
//   const id = parseInt(req.params.id);
//   const todo = todos.find((t) => t.id === id);
//   try {
//     if (!todo) {
//       res.status(404).json({ error: "Todo not found" });
//       return;
//     }
//     res.json({ todo });
//   } catch (error: unknown) {
//     res.status(500).json({ error: "Failed to retrieve todo" });
//   }
// };

// export const createTodo = (req: Request, res: Response) => {
//   const content = req.body.content;
//   try {
//     if (content === undefined) {
//       res.status(400).json({ error: "Content is required" });
//       return;
//     }
//     const newTodo = new Todo(content);
//     todos.push(newTodo);
//     res.status(201).json({ message: "New Todo created!", data: newTodo });
//   } catch (error: unknown) {
//     res.status(500).json({ error: "Failed to create todo" });
//   }
// };

// export const patchTodo = (req: Request, res: Response) => {
//   const { content, done } = req.body;
//   try {
//     if (content === undefined || done === undefined) {
//       res.status(400).json({ error: "Content and Done are required" });
//       return;
//     }
//     const todo = todos.find((t) => t.id === parseInt(req.params.id));
//     if (!todo) {
//       res.status(404).json({ error: "Todo not found" });
//       return;
//     }
//     todo.content = content;
//     todo.done = done;
//     res.json({ message: "Todo updated", data: todo });
//   } catch (error: unknown) {
//     res.status(500).json({ error: "Failed to update todo" });
//   }
// };

// export const deleteTodo = (req: Request, res: Response) => {
//   const id = parseInt(req.params.id);
//   const todoIndex = todos.findIndex((t) => t.id === id);
//   try {
//     if (todoIndex === -1) {
//       res.status(404).json({ error: "Todo not found" });
//       return;
//     }
//     todos.splice(todoIndex, 1);
//     res.json({ message: "Todo deleted!" });
//   } catch (error: unknown) {
//     res.status(500).json({ error: "Failed to delete todo" });
//   }
// };
