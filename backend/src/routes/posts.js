const router = require('express').Router();
const { z } = require('zod');
const { isValidObjectId } = require('mongoose');
const { Post, Comment } = require('../models');
const requireAuth = require('../middleware/requireAuth');
const validate = require('../middleware/validate');
const { ApiError, asyncHandler } = require('../utils/http');

const PAGE_SIZE = 10;
const postBody = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  content: z.string().trim().min(1, 'Content is required').max(50000),
  image: z.string().trim().url('Image must be a valid URL').max(500).optional().or(z.literal('')),
});
const commentBody = z.object({ text: z.string().trim().min(1, 'Comment cannot be empty').max(2000) });

// Malformed ids are simply "not found" rather than a 500.
const checkId = (req, res, next, id) => (isValidObjectId(id) ? next() : next(new ApiError(404, 'Not found')));
router.param('id', checkId);
router.param('cid', checkId);

const ensureOwner = (doc, userId) => {
  if (!doc) throw new ApiError(404, 'Not found');
  if (String(doc.author) !== userId) throw new ApiError(403, 'Not allowed');
};

// ---- Posts ----
router.get('/', asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const [posts, total] = await Promise.all([
    Post.find().sort('-createdAt').skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE).populate('author', 'name'),
    Post.countDocuments(),
  ]);
  res.json({ posts, page, pages: Math.max(1, Math.ceil(total / PAGE_SIZE)) });
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate('author', 'name');
  if (!post) throw new ApiError(404, 'Post not found');
  const comments = await Comment.find({ post: post._id }).sort('createdAt').populate('author', 'name');
  res.json({ post, comments });
}));

router.post('/', requireAuth, validate(postBody), asyncHandler(async (req, res) => {
  res.status(201).json(await Post.create({ ...req.body, author: req.userId }));
}));

router.put('/:id', requireAuth, validate(postBody.partial()), asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  ensureOwner(post, req.userId);
  Object.assign(post, req.body);
  res.json(await post.save());
}));

router.delete('/:id', requireAuth, asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  ensureOwner(post, req.userId);
  await Promise.all([post.deleteOne(), Comment.deleteMany({ post: post._id })]);
  res.json({ message: 'Deleted' });
}));

// ---- Comments ----
router.post('/:id/comments', requireAuth, validate(commentBody), asyncHandler(async (req, res) => {
  if (!(await Post.exists({ _id: req.params.id }))) throw new ApiError(404, 'Post not found');
  const comment = await Comment.create({ post: req.params.id, author: req.userId, text: req.body.text });
  res.status(201).json(await comment.populate('author', 'name'));
}));

router.delete('/:id/comments/:cid', requireAuth, asyncHandler(async (req, res) => {
  const comment = await Comment.findOne({ _id: req.params.cid, post: req.params.id });
  ensureOwner(comment, req.userId);
  await comment.deleteOne();
  res.json({ message: 'Deleted' });
}));

module.exports = router;
