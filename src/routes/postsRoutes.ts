import express, { Request, Response } from 'express';
import { createPost, deletePost, fetchAllPosts, fetchPost, patchPost } from '../controller/postController';
const router = express.Router();

// --- GET POSTS
router.get("/", fetchAllPosts);

// --- GET POSTS BY ID
router.get("/:id", fetchPost);

// --- CREATE/POST POSTS
router.post("/", createPost);

// --- UPDATE/PATCH POST
router.patch("/:id", patchPost);

// --- DELETE POST
router.delete("/:id", deletePost);

export default router;