const express = require("express");
const User = require("../models/User");
const Skill = require("../models/Skill");
const { protect } = require("../middleware/auth");

const router = express.Router();

// PUT /api/users/profile - update own profile
router.put("/profile", protect, async (req, res, next) => {
  try {
    const { name, bio, location } = req.body;
    if (name !== undefined) req.user.name = name;
    if (bio !== undefined) req.user.bio = bio;
    if (location !== undefined) req.user.location = location;
    await req.user.save();
    const u = req.user;
    res.json({ user: { _id: u._id, name: u.name, email: u.email, bio: u.bio, location: u.location, role: u.role, ratingAvg: u.ratingAvg, ratingCount: u.ratingCount } });
  } catch (err) { next(err); }
});

// GET /api/users/matches - smart matching
// Finds people who OFFER something I WANT. Mutual matches (they also WANT something I OFFER) rank first.
router.get("/matches", protect, async (req, res, next) => {
  try {
    const mine = await Skill.find({ owner: req.user._id });
    const myWants = mine.filter((s) => s.type === "want").map((s) => s.title.toLowerCase());
    const myOffers = mine.filter((s) => s.type === "offer").map((s) => s.title.toLowerCase());
    if (myWants.length === 0) return res.json([]);

    const others = await Skill.find({ owner: { $ne: req.user._id } }).populate("owner", "name location ratingAvg ratingCount");
    const byOwner = {};
    others.forEach((s) => {
      if (!s.owner) return;
      const id = s.owner._id.toString();
      byOwner[id] = byOwner[id] || { user: s.owner, offers: [], wants: [] };
      (s.type === "offer" ? byOwner[id].offers : byOwner[id].wants).push(s);
    });

    const hit = (a, list) => list.some((b) => a.includes(b) || b.includes(a));

    const matches = Object.values(byOwner)
      .map(({ user, offers, wants }) => {
        const canTeachMe = offers.filter((s) => hit(s.title.toLowerCase(), myWants));
        const wantsFromMe = wants.filter((s) => hit(s.title.toLowerCase(), myOffers));
        return { user, canTeachMe, wantsFromMe, mutual: canTeachMe.length > 0 && wantsFromMe.length > 0 };
      })
      .filter((m) => m.canTeachMe.length > 0)
      .sort((a, b) => Number(b.mutual) - Number(a.mutual) || b.canTeachMe.length - a.canTeachMe.length);

    res.json(matches);
  } catch (err) { next(err); }
});

// GET /api/users/:id - public profile with their skills
router.get("/:id", async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("name bio location ratingAvg ratingCount createdAt");
    if (!user) { res.status(404); throw new Error("User not found"); }
    const skills = await Skill.find({ owner: user._id }).sort({ createdAt: -1 });
    res.json({ user, skills });
  } catch (err) { next(err); }
});

module.exports = router;
