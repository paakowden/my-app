const express = require("express");
const router = express.Router();
const multer = require("multer");
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");

const User = require("../models/User");
const Advert = require("../models/Advert");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./clients/public/uploads");
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// @route     GET api/adds
// @desc      Get all adverts
// @access    Private

router.get("/", auth, async (req, res) => {
  try {
    const adverts = await Advert.find({ user: req.user.id }).sort({ date: -1 });
    res.json(adverts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route     POST api/adds
// @desc      Add new advert
// @access    Private

router.post(
  "/",
  [
    auth,
    upload.single("image"),
    [
      check("company_name", "Company name is required").not().isEmpty(),
      check("email", "Please include a valid email").isEmail(),
      check("address", "Please include an address").not().isEmpty(),
      check("phone", "Please enter only numbers").not().isEmpty(),
      check("description", "Please include a brief description about advert"),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    /*
    const {
      company_name,
      email,
      address,
      phone,
      description,
      image
    } = req.body;
*/
    try {
      const newAdvert = new Advert({
        company_name: req.body.company_name,
        email: req.body.email,
        address: req.body.address,
        phone: req.body.phone,
        description: req.body.description,
        image: req.file.originalname,
        user: req.user.id,
      });

      const advert = await newAdvert.save();
      res.json(advert);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route     PUT api/adds/:id
// @desc      Update an adverts
// @access    Private

router.put("/:id", (req, res) => {
  res.send("Update an advert");
});

// @route     DELETE api/adds/:id
// @desc      Delete an adverts
// @access    Private

router.delete("/:id", auth, async (req, res) => {
  try {
    let advert = await Advert.findById(req.params.id);

    if (!advert) return res.status(404).json({ msg: "Advert not found" });

    // Make sure user owns contact
    if (advert.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    await Advert.findByIdAndRemove(req.params.id);
    res.json({ msg: "Advert removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
