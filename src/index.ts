import express, { Request, Response } from 'express';
import { Todo } from './models/Todos';
import { Post } from './models/Posts';

const app = express();

// Sample Data
const todos: Todo[] = [
  new Todo('Handla'),
  new Todo('Chilla'),
  new Todo('Jobba'),
  new Todo('Festa'),
];

const posts: Post[] = [
  new Post('First Post', 'This is the content of the first post', 'Alice'),
  new Post('Second Post', 'Here comes the content for the second post', 'Bob'),
  new Post('Third Post', 'Content of the third post goes here', 'David'),
  new Post('Another Post', 'Some content by Charlie', 'Charlie'),
  new Post('A New Post', 'A new content piece for testing', 'Bob')
];

// ENDPOINTS
app.get('/', (_:Request, res: Response) => {
  res.send('Hello World!');
});

// POSTS
app.get('/posts', (req: Request, res: Response) => {
  const search = req.query.search;
  const sort = req.query.sort;
  let filteredPosts = posts;

  // Filter by author if 'search' query param is provided
  if (search) {
    filteredPosts = filteredPosts.filter((post) =>
      post.author.toLowerCase().includes(search.toString().toLowerCase())
    );
  }

  // Sort by title if 'sort' query param is provided (asc or desc)
  if (sort === 'asc') {
    filteredPosts = filteredPosts.sort((a, b) => {
      const titleA = a.title.toLowerCase();
      const titleB = b.title.toLowerCase();
      if (titleA > titleB) return 1;
      if (titleA < titleB) return -1;
      return 0;
    });
  } else if (sort === 'desc') {
    filteredPosts = filteredPosts.sort((a, b) => {
      const titleA = a.title.toLowerCase();
      const titleB = b.title.toLowerCase();
      if (titleA < titleB) return 1;
      if (titleA > titleB) return -1;
      return 0;
    });
  }

  // Return filtered and sorted posts
  res.json(filteredPosts);
});

app.get('/todos/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  const todo = todos.find((t) => t.id === parseInt(id));

  res.json({ todo });
});

// TODOS
app.get('/todos', (req: Request, res: Response) => {
  const search = req.query.search;
  const sort = req.query.sort;

  let filteredTodos = todos;

  if (search) {
    filteredTodos = filteredTodos.filter((t) => t.content.includes(search.toString()));
  }

  if (sort && sort === 'asc') {
    filteredTodos = filteredTodos.sort((a, b) => {
      const todo1 = a.content.toLowerCase();
      const todo2 = b.content.toLowerCase();

      if (todo1 > todo2) return 1;
      if (todo1 < todo2) return -1;
      return 0;
    });
  }

  if (sort && sort === 'desc') {
    filteredTodos = filteredTodos.sort((a, b) => {
      const todo1 = a.content.toLowerCase();
      const todo2 = b.content.toLowerCase();

      if (todo1 < todo2) return 1;
      if (todo1 > todo2) return -1;
      return 0;
    });
  }

  res.json(filteredTodos);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})