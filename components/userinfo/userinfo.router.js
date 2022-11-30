const express = require('express');

const router = express.Router();

const userinfoController = require("./userinfo.controller");

router.get("/", userinfoController.getAll)
router.get("/:id", userinfoController.getOneByID)
router.get("/infomation/:id", userinfoController.getOneInfoById)
module.exports = router;