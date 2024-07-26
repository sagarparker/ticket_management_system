const { validationResult } = require("express-validator");
const { v4: uuidv4 } = require('uuid');
const pg = require("pg");

const pool = new pg.Pool({
    connectionString: process.env.POSTGRES_URL,
})

const newTicket = async(req,res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            console.log(errors)
            return res.status(400).json({
                msg:"Invalid user details",
                error: errors.array()[0]
            })
        }
        let title = req.body.title;
        let description = req.body.description;
        let type = req.body.type;
        let venue = req.body.venue;
        let status = req.body.status;
        let priority = req.body.priority;
        let dueDate = req.body.dueDate;
        let createdBy = req.body.createdBy;
        let ticket_id = uuidv4();

        let userFindQuery = await pool.query(`SELECT name FROM users WHERE id=$1`,[createdBy]);
        if(userFindQuery.rowCount==0){
            return res.status(400).json({
                msg:"User with given id not found"
            })
        }

        let query = await pool.query(
            `INSERT INTO tickets 
            VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`
        ,[ticket_id,title,description,type,venue,status,priority,dueDate,createdBy,[]])
        
        if(query.rowCount>0){
            return res.status(200).json({
                "id": ticket_id,
                "title": title,
                "description": description,
                "type": type,
                "venue": venue,
                "status": status,
                "priority": priority,
                "dueDate": dueDate,
                "createdBy": createdBy,
                "assignedUsers": []
            })
        }

        res.status(500).json({
            msg:"There was an issue while generating a new ticket"
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg:"There was an issue while generating a new ticket"
        })   
    }
}

const assignUserToTicket = async(req,res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            console.log(errors)
            return res.status(400).json({
                msg:"Invalid user details",
                error: errors.array()[0]
            })
        }
        let user_id = req.body.user_id;
        let ticket_id = req.params.ticketId;
        let find_user_query = await pool.query("SELECT name FROM USERS WHERE id=$1",[user_id]);
        if(find_user_query.rowCount==0){
            return res.status(404).json({
                msg:`No user with user id : ${user_id} found`
            })
        }
        let find_ticket = await pool.query("SELECT status,assigned_users FROM tickets WHERE ticket_id=$1",[ticket_id])
        if(find_ticket.rowCount===0){
            return res.status(404).json({
                msg:`No ticket found with id : ${ticket_id}`
            })
        }
        if(find_ticket.rows[0].status === "closed"){
            return res.status(400).json({
                msg:"The ticket needs to be open"
            })
        }

        if(find_ticket.rows[0].assigned_users.length>5){
            return res.status(400).json({
                msg:"The ticket cannot have more than 5 users assigned."
            })
        }
        let assigned_users = [...find_ticket.rows[0].assigned_users,user_id]
        let assing_user_query = await pool.query("UPDATE tickets SET assigned_users=$1 WHERE ticket_id=$2",[assigned_users,ticket_id]);
        if(assing_user_query.rowCount==0){
            return res.status(500).json({
                msg:"There was an issue while assigning user to the ticket"
            })
        }

        res.status(200).json({
            msg:`User : ${user_id} assigned to the ticket : ${ticket_id}`
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg:"There was an issue while assigning the tickets to the user"
        })
    }
}

module.exports = {
    newTicket,assignUserToTicket
}