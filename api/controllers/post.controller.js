import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

const geocodeAddress = async (address, city) => {
    try {
        const query = encodeURIComponent(`${address}, ${city}`);
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`, {
            headers: {
                'User-Agent': 'EstateHub-App/1.0 (Contact: admin@estatehub.com)'
            }
        });
        const data = await response.json();
        if (data && data.length > 0) {
            return {
                latitude: data[0].lat,
                longitude: data[0].lon
            };
        }
        return null;
    } catch (err) {
        console.error("Geocoding error:", err);
        return null;
    }
};

export const getPosts = async (req, res) => {
  const query = req.query;
  console.log(query);
  try {
    const posts = await prisma.post.findMany({
      where: {
        city: query.city || undefined,
        type: query.type || undefined,
        property: query.property || undefined,
        bedroom: parseInt(query.bedroom) || undefined,
        price: {
          gte: parseInt(query.minPrice) || undefined,
          lte: parseInt(query.maxPrice) || undefined,
        },
      },
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
            role: true,
            agentStatus: true,
          },
        },
      },
    });

    // setTimeout(() => {
    res.status(200).json(posts);
    // }, 3000);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get posts" });
  }
};

export const getPost = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        postDetail: true,
        user: {
          select: {
            username: true,
            avatar: true,
            role: true,
            agentStatus: true,
          },
        },
      },
    });

    const token = req.cookies?.token;

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if (!err) {
          const saved = await prisma.savedPost.findUnique({
            where: {
              userId_postId: {
                postId: id,
                userId: payload.id,
              },
            },
          });
          return res.status(200).json({ ...post, isSaved: saved ? true : false });
        }
        return res.status(200).json({ ...post, isSaved: false });
      });
    } else {
      return res.status(200).json({ ...post, isSaved: false });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get post" });
  }
};

export const addPost = async (req, res) => {
  const body = req.body;
  const tokenUserId = req.userId;

  try {
    const coords = await geocodeAddress(body.postData.address, body.postData.city);
    if (!coords) {
        return res.status(400).json({ message: "Could not find coordinates for this address. Please check your address and try again." });
    }
    body.postData.latitude = coords.latitude;
    body.postData.longitude = coords.longitude;

    const newPost = await prisma.post.create({
      data: {
        ...body.postData,
        userId: tokenUserId,
        postDetail: {
          create: body.postDetail,
        },
      },
    });
    res.status(200).json(newPost);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create post" });
  }
};

export const updatePost = async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  const tokenUserId = req.userId;

  try {
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (post.userId !== tokenUserId) {
      return res.status(403).json({ message: "Not Authorized!" });
    }

    const coords = await geocodeAddress(body.postData.address, body.postData.city);
    if (!coords) {
        return res.status(400).json({ message: "Could not find coordinates for this address. Please check your address and try again." });
    }
    body.postData.latitude = coords.latitude;
    body.postData.longitude = coords.longitude;

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        ...body.postData,
        postDetail: {
          update: body.postDetail,
        },
      },
    });

    res.status(200).json(updatedPost);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to update post" });
  }
};

export const deletePost = async (req, res) => {
  const postId = req.params.id;
  const tokenUserId = req.userId;

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        postDetail: true, // Include PostDetail to check if it exists
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the current user is the owner of the post
    if (post.userId !== tokenUserId) {
      return res.status(403).json({ message: "Not Authorized!" });
    }

    // Step 1: Delete related saved posts (if any)
    await prisma.savedPost.deleteMany({
      where: { postId },
    });

    // Step 2: Delete related post details (if any)
    if (post.postDetail) {
      await prisma.postDetail.delete({
        where: { postId: postId },
      });
    }

    // Step 3: Delete the post itself
    await prisma.post.delete({
      where: { id: postId },
    });

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Error deleting post:", err);
    res
      .status(500)
      .json({ message: "Failed to delete post", error: err.message });
  }
};
