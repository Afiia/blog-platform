const mongoose = require('mongoose');
const config = require('./config');
const { User, Post, Comment } = require('./models');

const img = s => `https://picsum.photos/seed/${s}/900/450`;
const POSTS = [
  ['Getting Started with Remote Work', 'remote', 'Working from home sounds simple until the kitchen table becomes your office. A dedicated workspace, a fixed start time, and a real lunch break changed everything for me.'],
  ['A Weekend in the Mountains', 'mountain', 'We left the city at dawn and reached the trailhead by nine. The summit view was worth every blister, and the hot soup afterwards tasted better than any restaurant meal.'],
  ['Why I Switched to Minimalist Cooking', 'cooking', 'Five ingredients, one pan, twenty minutes. Cutting down on complexity made me cook more often, waste less food, and actually enjoy weeknights again.'],
  ['The Joy of Learning to Code', 'coding', 'My first working program printed a single line of text, and I was thrilled. Keep projects small, ship often, and let curiosity pick your next topic.'],
  ['City Photography Tips for Beginners', 'city', 'Golden hour does most of the work for you. Look for reflections, leading lines, and people in motion, and always walk one more block than feels necessary.'],
  ['Building a Reading Habit That Lasts', 'books', 'Twenty pages a day adds up to more than twenty books a year. I keep a book by the bed and my phone in another room, and the habit stuck within a month.'],
  ['A Beginner Guide to Houseplants', 'plants', 'Start with forgiving plants like pothos and snake plants. Most plants die from overwatering, so check the soil with your finger before reaching for the watering can.'],
  ['Notes from a Week Offline', 'offline', 'I turned off notifications for seven days. Evenings felt longer, conversations got deeper, and I discovered how often I reached for my phone out of pure habit.'],
  ['Travel Light: My Packing Method', 'travel', 'One bag, five outfits that all match, and a small laundry kit. Traveling light means fewer decisions, faster airports, and more room for souvenirs.'],
  ['Morning Routines That Actually Work', 'morning', 'Skip the five-hour routines from social media. Water, ten minutes of movement, and a plan for the day are enough to start well.'],
];
const COMMENTS = ['Great read, thanks for sharing!', 'This really resonated with me.', 'Love the practical tips. Saving this one.', 'Can you write a follow-up post on this?'];

async function seed() {
  const user = async (name, email) => (await User.findOne({ email })) || User.create({ name, email, password: 'password123' });
  const author = await user('Demo Author', 'demo@blogspace.dev');
  const reader = await user('Sam Reader', 'sam@blogspace.dev');
  const old = await Post.find({ author: author._id }).select('_id');
  await Comment.deleteMany({ post: { $in: old.map(p => p._id) } });
  await Post.deleteMany({ author: author._id });
  for (const [i, [title, s, text]] of POSTS.entries()) {
    const post = await Post.create({ title, content: `${text}\n\n${text}`, image: img(s), author: author._id, createdAt: new Date(Date.now() - i * 864e5) });
    for (const c of COMMENTS.slice(0, (i % 3) + 1)) await Comment.create({ post: post._id, author: reader._id, text: c });
  }
  console.log(`Seeded ${POSTS.length} sample posts. Demo login: demo@blogspace.dev / password123`);
}

module.exports = { seed };

if (require.main === module) {
  mongoose.connect(config.MONGO_URI).then(seed).then(() => mongoose.disconnect()).catch(e => { console.error(e.message); process.exit(1); });
}
