const express = require("express");

const router = express.Router();

const walletController = require("../controllers/walletController");

router.get("/:userId", walletController.getWallet);

router.put("/:userId/settings", walletController.updateSettings);

router.post("/:userId/save", walletController.saveRent);

router.post("/:userId/reset", walletController.resetWallet);

module.exports = router;