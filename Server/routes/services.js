const express = require("express");
const router = express.Router();
const { dashInfo, filtersSP, updateDashInfo, deleteUser } = require("../handlers/services");
const { loginRequired, ensureCorrectUser } = require("../middlewares/auth");

router.get("/:role/:uid", loginRequired, ensureCorrectUser, dashInfo);
router.put("/:role/:uid", loginRequired, ensureCorrectUser, updateDashInfo);
router.delete("/:role/:uid", loginRequired, ensureCorrectUser, deleteUser);
router.get("/:filter", filtersSP);

module.exports = router;