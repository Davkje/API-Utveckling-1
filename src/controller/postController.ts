import { Request, Response } from "express";
import { Post } from "../models/Posts";

const posts: Post[] = [
  new Post("First Post", "This is the content of the first post", "Alice"),
  new Post("Second Post", "Here comes the content for the second post", "Bob"),
  new Post("Third Post", "Content of the third post goes here", "David"),
  new Post("Another Post", "Some content by Charlie", "Charlie"),
  new Post("A New Post", "A new content piece for testing", "Bob"),
];

export const fetchAllPosts = (req: Request, res: Response) => {
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
};

export const fetchPost = (req: Request, res: Response) => {
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
};

export const createPost = (req: Request, res: Response) => {
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
};

export const patchPost = (req: Request, res: Response) => {
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
};

export const deletePost = (req: Request, res: Response) => {
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
};