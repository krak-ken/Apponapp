const express = require("express");
const router = express.Router();
const { bookSlot, viewSP, deleteSlot } = require("../handlers/book");
const { loginRequired, ensureCorrectUser } = require("../middlewares/auth");

router.post("/:uid/:profession/:pid/book/:slot", loginRequired, ensureCorrectUser, bookSlot);
router.delete("/:uid/:profession/:pid/book/:slot", loginRequired, ensureCorrectUser, deleteSlot);
router.get("/:uid/:profession/:pid", loginRequired, viewSP);

module.exports = router;