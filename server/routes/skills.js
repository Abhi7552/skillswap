const express = require("express");
const Skill = require("../models/Skill");
const { protect } = require("../middleware/auth");

const router = express.Router();

// GET /api/skills?type=offer&category=Music&q=guitar&page=1&limit=9   (public)
router.get("/", async (req, res, next) => {
  try {
    const { type, category, q, mode } = req.query;
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 9, 50);

    const filter = {};
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (mode) filter.mode = mode;
    if (q) filter.title = { $regex: q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" };

    const [skills, total] = await Promise.all([
      Skill.find(filter).populate("owner", "name location ratingAvg ratingCount")
        .sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      Skill.countDocuments(filter),
    ]);
    res.json({ skills, total, page, pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
});

// GET /api/skills/mine  (protected) - must be declared before "/:id"
router.get("/mine", protect, async (req, res, next) => {
  try {
    res.json(await Skill.find({ owner: req.user._id }).sort({ createdAt: -1 }));
  } catch (err) { next(err); }
});

// GET /api/skills/:id  (public)
router.get("/:id", async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id).populate("owner", "name bio location ratingAvg ratingCount");
    if (!skill) { res.status(404); throw new Error("Skill not found"); }
    res.json(skill);
  } catch (err) { next(err); }
});

// POST /api/skills
router.post("/", protect, async (req, res, next) => {
  try {
    const { title, category, type, level, description, mode } = req.body;
    const skill = await Skill.create({ owner: req.user._id, title, category, type, level, description, mode });
    res.status(201).json(skill);
  } catch (err) { next(err); }
});

// PUT /api/skills/:id  (owner only)
router.put("/:id", protect, async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) { res.status(404); throw new Error("Skill not found"); }
    if (skill.owner.toString() !== req.user._id.toString()) { res.status(403); throw new Error("You can only edit your own skills"); }
    ["title", "category", "type", "level", "description", "mode"].forEach((k) => {
      if (req.body[k] !== undefined) skill[k] = req.body[k];
    });
    await skill.save();
    res.json(skill);
  } catch (err) { next(err); }
});

// DELETE /api/skills/:id  (owner or admin)
router.delete("/:id", protect, async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) { res.status(404); throw new Error("Skill not found"); }
    if (skill.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      res.status(403); throw new Error("Not allowed to delete this skill");
    }
    await skill.deleteOne();
    res.json({ message: "Skill deleted" });
  } catch (err) { next(err); }
});

module.exports = router;
