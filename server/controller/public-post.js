import { Post } from "../models/index.js";

export const getPostByOrgProfile = async (req, res) => {
  try {
    const { orgProfileId } = req.params;
    const posts = await Post.find({ organizationProfile: orgProfileId })
      .populate("organization", "name")
      .populate("organizationProfile", "logo bio")
      .exec();

    console.log(posts);

    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: "No post(s) found" });
    }

    console.log("Fetched posts:", posts);

    res.status(200).json(posts);
  } catch (err) {
    console.error("getPostByOrgProfile error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

export const addDocumentsToPost = async (req, res) => {
  try {
    const { caption, tags, title } = req.body;

    if (!res.locals.documentIds || res.locals.documentIds.length === 0) {
      return res.status(400).json({ error: "No documents to attach" });
    }

    // Create a brand-new post
    const newPost = new Post({
      caption,
      organization,
      organizationProfile,
      tags,
      title,
      content: res.locals.documentIds, // add all documents
    });

    const savedPost = await newPost.save();

    return res.status(201).json({
      message: "Post created with documents",
      post: savedPost,
    });
  } catch (err) {
    console.error("addDocumentsToPost error:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const getPostForPublic = async (req, res) => {
  try {
    const { id } = req.params;

    let query = Post.find();

    if (id) {
      query = Post.findById(id);
    }

    // Populate references
    query = query
      .populate("organization", "name") // only get name from org
      .populate("organizationProfile", "logo bio") // limit fields
      .populate("content"); // documents

    const posts = await query.exec();

    if (!posts || (Array.isArray(posts) && posts.length === 0)) {
      return res.status(404).json({ message: "No post(s) found" });
    }

    res.status(200).json(posts);
  } catch (err) {
    console.error("getPost error:", err);
    res.status(500).json({ error: err.message });
  }
};
