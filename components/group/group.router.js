const express = require('express');

const router = express.Router();

const groupController = require("./group.controller");

router.get("/", groupController.getAll);
router.get("/:id", groupController.getOne);
router.get("/:id/member", groupController.getGroupMember);
router.post("/add", groupController.addGroup);
router.post("/addmember", groupController.addOne);

router.delete("/:groupid/member/delete/:memberid", groupController.deleteOne);
router.patch("/:groupid/member/update/:memberid", groupController.updateOne);
router.post("/addmember", groupController.addOne);
module.exports = router;