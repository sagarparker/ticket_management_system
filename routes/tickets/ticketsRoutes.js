const express = require("express");
const { newTicket,assignUserToTicket } = require("../../controllers/tickets/tickets");
const router = express.Router();
const {body} = require("express-validator");
const { isAuthenticated } = require("../../middleware/auth");

//Create a new ticket
router.post("/tickets",
    isAuthenticated,
    [
        body('title').notEmpty(),
        body('description').notEmpty(),
        body('type').notEmpty(),
        body('venue').notEmpty(),
        body('priority').notEmpty(),
        body('dueDate').notEmpty(),
        body('createdBy').notEmpty()
    ],
    newTicket
);

//Assign a ticket
router.post("/tickets/:ticketId/assign",isAuthenticated,
    [body("user_id").notEmpty()],
    assignUserToTicket
)


module.exports = router;