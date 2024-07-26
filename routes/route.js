const express = require("express");
const router = express.Router();
const AuthRoutes = require("./auth/userAuthRoutes");
const TicketsRoutes = require('./tickets/ticketsRoutes');

router.use(AuthRoutes);
router.use(TicketsRoutes);

module.exports = router;