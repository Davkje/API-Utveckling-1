import express from "express";

const app = express();

//  MIDDLEWARE
app.use(express.json());

// ROUTES
import todoRouter from './routes/todosRoutes'
import postRouter from './routes/postsRoutes'

app.use('/todos', todoRouter)
app.use('/posts', postRouter)

const PORT = 3000;
app.listen(PORT, () => {
	console.log(`Server is running at http://localhost:${PORT}`);
});
