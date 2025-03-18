import express, { Request, Response } from 'express';
import { Todo } from './models/Todos';
import { Post } from './models/Posts';
const app = express();
const PORT = 3000;

// Define root path with message
// req, handles the incoming request from the client
// res, handles the outgoing response back ti the client
// May use _ to indicate that the parameter is not used
app.get('/', (_:Request, res: Response) => {
  res.send('Hello World!');
});

const todos: Todo[] = [
  new Todo('Handla'),
  new Todo('Chilla'),
  new Todo('Jobba'),
  new Todo('Festa'),
]

app.get('/todos', (_: Request, res: Response) => {
  res.json(todos);
})

const posts: Post[] = [
  new Post('David',),
  new Post('Josefin'),
  new Post('Sascha'),
]

app.get('/posts', (_: Request, res: Response) => {
  res.json(posts);
})

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})