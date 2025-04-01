import "dotenv/config";
import express from "express";
import cors from 'cors'
import { connectToDatabase } from "./config/db";

const app = express();

//  MIDDLEWARE
app.use(express.json());
app.use(cors());

// ROUTES
import todoRouter from './routes/todosRoutes'
import postRouter from './routes/postsRoutes'

app.use('/todos', todoRouter)
app.use('/posts', postRouter)

// Connect To DB
connectToDatabase();

const PORT = 3000;
app.listen(PORT, () => {
	console.log(`Server is running at http://localhost:${PORT}`);
});
