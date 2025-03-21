import express, { Request, Response } from "express";
import { Todo } from "./models/Todos";
import { Post } from "./models/Posts";

const app = express();

// GENERAL MIDDLEWARE For all request
app.use(express.json());

// Sample Data
const todos: Todo[] = [new Todo("Släng sopor"), new Todo("Chilla"), new Todo("Jobba"), new Todo("Festa")];

const posts: Post[] = [
	new Post("First Post", "This is the content of the first post", "Alice"),
	new Post("Second Post", "Here comes the content for the second post", "Bob"),
	new Post("Third Post", "Content of the third post goes here", "David"),
	new Post("Another Post", "Some content by Charlie", "Charlie"),
	new Post("A New Post", "A new content piece for testing", "Bob"),
];

//  ------ ENDPOINTS -------
app.get("/", (_: Request, res: Response) => {
	res.send("Hello World!");
});

// -------- TODOS ENPOINTS --------

// --- GET TODO
app.get("/todos", (req: Request, res: Response) => {
	try {
		const search = req.query.search;
		const sort = req.query.sort;
		let filteredTodos = todos;
		if (search) {
			filteredTodos = filteredTodos.filter((t) => t.content.includes(search.toString()));
		}
		if (sort && sort === "asc") {
			filteredTodos = filteredTodos.sort((a, b) => a.content.localeCompare(b.content));
		}
		if (sort && sort === "desc") {
			filteredTodos = filteredTodos.sort((a, b) => b.content.localeCompare(a.content));
		}
		res.json(filteredTodos);
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Unknown error";
		res.status(500).json({ error: message });
	}
});

// --- GET TODOS BY ID
app.get("/todos/:id", (req: Request, res: Response) => {
	const id = parseInt(req.params.id);
	const todo = todos.find((t) => t.id === id);
	try {
		if (!todo) {
			res.status(404).json({ error: "Todo not found" });
			return;
		}
		res.json({ todo });
	} catch (error: unknown) {
		res.status(500).json({ error: "Failed to retrieve todo" });
	}
});

// --- CREATE/POST TODO
app.post("/todos", (req: Request, res: Response) => {
	const content = req.body.content;
	try {
		if (content === undefined) {
			res.status(400).json({ error: "Content is required" });
			return;
		}
		const newTodo = new Todo(content);
		todos.push(newTodo);
		res.status(201).json({ message: "New Todo created!", data: newTodo });
	} catch (error: unknown) {
		res.status(500).json({ error: "Failed to create todo" });
	}
});

// --- UPDATE/PATCH TODO
app.patch("/todos/:id", (req: Request, res: Response) => {
	const { content, done } = req.body;
	try {
		if (content === undefined || done === undefined) {
			res.status(400).json({ error: "Content and Done are required" });
			return;
		}
		const todo = todos.find((t) => t.id === parseInt(req.params.id));
		if (!todo) {
			res.status(404).json({ error: "Todo not found" });
			return;
		}
		todo.content = content;
		todo.done = done;
		res.json({ message: "Todo updated", data: todo });
	} catch (error: unknown) {
		res.status(500).json({ error: "Failed to update todo" });
	}
});

// --- DELETE TODO
app.delete("/todos/:id", (req: Request, res: Response) => {
	const id = parseInt(req.params.id);
	const todoIndex = todos.findIndex((t) => t.id === id);
	try {
		if (todoIndex === -1) {
			res.status(404).json({ error: "Todo not found" });
			return;
		}
		todos.splice(todoIndex, 1);
		res.json({ message: "Todo deleted!" });
	} catch (error: unknown) {
		res.status(500).json({ error: "Failed to delete todo" });
	}
});

// ---------------------------------

// -------- POSTS ENDPOINTS --------
// --- GET POSTS
app.get("/posts", (req: Request, res: Response) => {
	const search = req.query.search;
	const sort = req.query.sort;
	let filteredPosts = posts;
	try {
		if (search) {
			filteredPosts = filteredPosts.filter((post) => post.author.toLowerCase().includes(search.toString().toLowerCase()));
		}

		if (sort === "asc") {
			filteredPosts = filteredPosts.sort((a, b) => a.title.localeCompare(b.title));
		} else if (sort === "desc") {
			filteredPosts = filteredPosts.sort((a, b) => b.title.localeCompare(a.title));
		}

		res.json(filteredPosts);
	} catch (error: unknown) {
		res.status(500).json({ error: "Failed to retrieve posts" });
	}
});

// --- GET POSTS BY ID
app.get("/posts/:id", (req: Request, res: Response) => {
	const id = parseInt(req.params.id);
	const post = posts.find((p) => p.id === id);
	try {
		if (!post) {
			res.status(404).json({ error: "Post not found" });
			return;
		}
		res.json({ post });
	} catch (error: unknown) {
		res.status(500).json({ error: "Failed to retrieve post" });
	}
});

// --- CREATE/POST POSTS
app.post("/posts", (req: Request, res: Response) => {
	const { title, content, author } = req.body;
	try {
		if (!title || !content || !author) {
			res.status(400).json({ error: "Title, content, and author are required" });
			return;
		}

		const newPost = new Post(title, content, author);
		posts.push(newPost);
		res.status(201).json({ message: "New Post created!", data: newPost });
	} catch (error: unknown) {
		res.status(500).json({ error: "Failed to create post" });
	}
});


// --- UPDATE/PATCH POST
app.patch("/posts/:id", (req: Request, res: Response) => {
  const { title, content, author } = req.body;
  try {
    if (title === undefined || content === undefined || author === undefined) {
      res.status(400).json({ error: "Title, Content and Author are required" });
      return;
    }
    const post = posts.find((p) => p.id === parseInt(req.params.id));
    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }
    post.title = title;
    post.content = content;
    post.author = author;
    res.json({ message: "Post updated", data: post });
  } catch (error: unknown) {
    res.status(500).json({ error: "Failed to update post" });
  }
});

// --- DELETE POST
app.delete("/posts/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const postIndex = posts.findIndex((p) => p.id === id);
    if (postIndex === -1) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    posts.splice(postIndex, 1);
    res.json({ message: "Post deleted!" });
  } catch (error: unknown) {
    res.status(500).json({ error: "Failed to delete post" });
  }
});

// ----------

const PORT = 3000;
app.listen(PORT, () => {
	console.log(`Server is running at http://localhost:${PORT}`);
});
