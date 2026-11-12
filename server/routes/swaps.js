const express = require("express");
const Swap = require("../models/Swap");
const User = require("../models/User");
const { protect } = require("../middleware/auth");

const router = express.Router();
router.use(protect);

const populate = (q) =>
  q.populate("requester", "name location").populate("receiver", "name location").populate("reviews.reviewer", "name");

// GET /api/swaps - all swaps involving me
router.get("/", async (req, res, next) => {
  try {
    const swaps = await populate(
      Swap.find({ $or: [{ requester: req.user._id }, { receiver: req.user._id }] }).sort({ createdAt: -1 })
    );
    res.json(swaps);
  } catch (err) { next(err); }
});

// POST /api/swaps - send a swap request
router.post("/", async (req, res, next) => {
  try {
    const { receiver, offeredSkill, requestedSkill, message } = req.body;
    if (!receiver) { res.status(400); throw new Error("Receiver is required"); }
    if (receiver === req.user._id.toString()) { res.status(400); throw new Error("You cannot swap with yourself"); }
    const exists = await User.findById(receiver);
    if (!exists) { res.status(404); throw new Error("Receiver not found"); }

    const dup = await Swap.findOne({ requester: req.user._id, receiver, requestedSkill, status: "pending" });
    if (dup) { res.status(400); throw new Error("You already have a pending request for this skill"); }

    const swap = await Swap.create({ requester: req.user._id, receiver, offeredSkill, requestedSkill, message });
    res.status(201).json(swap);
  } catch (err) { next(err); }
});

// PUT /api/swaps/:id/status - receiver accepts/declines; either party marks completed
router.put("/:id/status", async (req, res, next) => {
  try {
    const { status } = req.body;
    const swap = await Swap.findById(req.params.id);
    if (!swap) { res.status(404); throw new Error("Swap not found"); }

    const me = req.user._id.toString();
    const isReceiver = swap.receiver.toString() === me;
    const isRequester = swap.requester.toString() === me;
    if (!isReceiver && !isRequester) { res.status(403); throw new Error("Not part of this swap"); }

    if (["accepted", "declined"].includes(status)) {
      if (!isReceiver || swap.status !== "pending") { res.status(403); throw new Error("Only the receiver can respond to a pending request"); }
    } else if (status === "completed") {
      if (swap.status !== "accepted") { res.status(400); throw new Error("Only accepted swaps can be completed"); }
    } else {
      res.status(400); throw new Error("Invalid status");
    }
    swap.status = status;
    await swap.save();
    res.json(swap);
  } catch (err) { next(err); }
});

// POST /api/swaps/:id/review - rate the other person after completion
router.post("/:id/review", async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const swap = await Swap.findById(req.params.id);
    if (!swap) { res.status(404); throw new Error("Swap not found"); }
    if (swap.status !== "completed") { res.status(400); throw new Error("You can review only completed swaps"); }

    const me = req.user._id.toString();
    const isRequester = swap.requester.toString() === me;
    if (!isRequester && swap.receiver.toString() !== me) { res.status(403); throw new Error("Not part of this swap"); }
    if (swap.reviews.some((r) => r.reviewer.toString() === me)) { res.status(400); throw new Error("You already reviewed this swap"); }
    if (!rating || rating < 1 || rating > 5) { res.status(400); throw new Error("Rating must be between 1 and 5"); }

    swap.reviews.push({ reviewer: req.user._id, rating, comment });
    await swap.save();

    const target = await User.findById(isRequester ? swap.receiver : swap.requester);
    target.ratingAvg = (target.ratingAvg * target.ratingCount + rating) / (target.ratingCount + 1);
    target.ratingCount += 1;
    await target.save();

    res.json({ message: "Review saved" });
  } catch (err) { next(err); }
});

module.exports = router;
