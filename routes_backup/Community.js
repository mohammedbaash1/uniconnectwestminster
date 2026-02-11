const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Model = require('../models/community'); // Change 'Job' to 'Accommodation' or 'Community' depending on the file!

router.get('/', auth, async (req, res) => {
    try {
        const data = await Model.find();
        res.json(data);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

module.exports = router;