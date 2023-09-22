const express = require("express");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const router = express.Router();

const stuffCtrl = require("../controllers/stuff");
router.get("/bestrating", stuffCtrl.getBestRatedBooks);
router.get("/", stuffCtrl.getAllStuff);
router.post("/", auth, multer, stuffCtrl.createThing);
router.get("/:id", stuffCtrl.getOneThing);
router.put("/:id", auth, multer, stuffCtrl.modifyThing);
router.delete("/:id", auth, stuffCtrl.deleteThing);
router.post("/:id/rating", auth, stuffCtrl.addRating);

module.exports = router;
