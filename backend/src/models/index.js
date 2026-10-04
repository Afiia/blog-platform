const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const ref = name => ({ type: Schema.Types.ObjectId, ref: name, required: true, index: true });

// Expose `id` instead of `_id`/`__v`, and never leak the password hash.
const toJSON = { transform: (_, r) => { r.id = r._id; delete r._id; delete r.__v; delete r.password; return r; } };

const userSchema = new Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
}, { timestamps: true, toJSON });

userSchema.pre('save', async function () {
  if (this.isModified('password')) this.password = await bcrypt.hash(this.password, 12);
});
userSchema.methods.verifyPassword = function (plain) { return bcrypt.compare(plain, this.password); };

const postSchema = new Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  content: { type: String, required: true },
  image: { type: String, trim: true },
  author: ref('User'),
}, { timestamps: true });
postSchema.index({ createdAt: -1 });

const commentSchema = new Schema({
  post: ref('Post'), author: ref('User'),
  text: { type: String, required: true, trim: true, maxlength: 2000 },
}, { timestamps: true });

module.exports = {
  User: model('User', userSchema),
  Post: model('Post', postSchema),
  Comment: model('Comment', commentSchema),
};
