const express = require("express");
const router = express.Router();

// @route     GET api/adds
// @desc      Get all adverts
// @access    Private

router.get("/", (req, res) => {
  res.send("Get all adverts");
});

// @route     POST api/adds
// @desc      Add new advert
// @access    Private

router.post("/", (req, res) => {
  res.send("Post an advert");
});

// @route     PUT api/adds/:id
// @desc      Update an adverts
// @access    Private

router.put("/:id", (req, res) => {
  res.send("Update an advert");
});

// @route     DELETE api/adds/:id
// @desc      Delete an adverts
// @access    Private

router.delete("/:id", (req, res) => {
  res.send("Delete an advert");
});

module.exports = router;
