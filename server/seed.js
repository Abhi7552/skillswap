// Optional: fills the database with demo users and skills.  Run: npm run seed
// Demo login: asha@demo.com / password123  (all demo users share this password)
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Skill = require("./models/Skill");
const Swap = require("./models/Swap");

const users = [
  { name: "Asha Verma", email: "asha@demo.com", location: "Jalandhar", bio: "CS student. Loves guitar and teaching Python.",
    offer: [["Python", "Programming", "Advanced"], ["Web Development", "Programming", "Intermediate"]], want: [["Guitar", "Music", "Beginner"]] },
  { name: "Karan Singh", email: "karan@demo.com", location: "Ludhiana", bio: "Musician. Learning to code.",
    offer: [["Guitar", "Music", "Advanced"], ["Punjabi", "Languages", "Advanced"]], want: [["Python", "Programming", "Beginner"]] },
  { name: "Meera Kapoor", email: "meera@demo.com", location: "Chandigarh", bio: "Designer who bakes on weekends.",
    offer: [["UI Design", "Design", "Advanced"], ["Baking", "Cooking", "Intermediate"]], want: [["Web Development", "Programming", "Beginner"], ["Spanish", "Languages", "Beginner"]] },
  { name: "Rohan Gill", email: "rohan@demo.com", location: "Amritsar", bio: "Fitness coach and Spanish speaker.",
    offer: [["Fitness Training", "Fitness", "Advanced"], ["Spanish", "Languages", "Intermediate"]], want: [["UI Design", "Design", "Beginner"]] },
];

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Promise.all([User.deleteMany({}), Skill.deleteMany({}), Swap.deleteMany({})]);
  for (const u of users) {
    const user = await User.create({ name: u.name, email: u.email, password: "password123", location: u.location, bio: u.bio });
    const docs = [
      ...u.offer.map(([title, category, level]) => ({ owner: user._id, type: "offer", title, category, level, mode: "Online", description: `Happy to teach ${title} step by step.` })),
      ...u.want.map(([title, category, level]) => ({ owner: user._id, type: "want", title, category, level, mode: "Online", description: `Looking for a patient teacher for ${title}.` })),
    ];
    await Skill.insertMany(docs);
  }
  console.log("Seeded demo data. Login with asha@demo.com / password123");
  process.exit(0);
})();
