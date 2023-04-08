"use strict"

const express = require('express');
const cors = require('cors');
const { db, connectToDB } = require('./db');
const PORT = 8080

const corsOptions = { origin: `*` };

const app = express();
app.use(cors(corsOptions));
app.use(express.json())

app.get('/', () => {
    connectToDB()
})

app.get("/allChannels", (req, res) => {
    try {
        db.query("SELECT * FROM channels", (err, rows, result) => {
            if (err) throw err;
            res.send(rows);
        })
    } catch (err) { console.log(err) }
});

app.post("/createChannel", (req, res) => {
    const { name } = req.body;
    try {
        db.query(`INSERT INTO channels (name) VALUES (?)`, [name])
        db.query("SELECT * FROM channels WHERE id = LAST_INSERT_ID()", (err, rows, result) => {
            if (err) throw err;
            res.send(rows[0]);
        })
        // res.send(`New channel '${name}' has been created`);
    } catch (err) { console.log(err) }
});

app.post("/createAccountOrSignIn", async (req, res) => {
    const { name, password, isLogIn } = req.body;
    try {
        if (isLogIn) {
            db.query(`SELECT * FROM users WHERE name=?`, [name], (err, rows, result) => {

                if (err) throw err;

                if (rows.length === 0) { return res.status(400).json({ message: 'This account does not exist' }); }
                if (rows[0].password != password) { return res.status(400).json({ message: 'Password is incorrect' }); }
                return res.status(200).send({ id: rows[0].id, name: rows[0].name });
            })
        } else {

            db.query(`SELECT name,password FROM users WHERE name=?`, [name], (err, rows, result) => {
                if (err) throw err;
                if (rows.length != 0) { return res.send(400).json({ message: 'An account with this name already exists' }) }
                db.query(`INSERT INTO users (name,password) VALUES (?,?)`, [name, password], (err, rows, result) => {
                    if (err) throw err;
                    db.query(`SELECT * FROM users WHERE id = LAST_INSERT_ID()`, (err, rows, result) => {
                        if (err) throw err;
                        return res.status(200).send({ id: rows[0].id, name: rows[0].name });
                    })
                })
            })
        }
    } catch (err) {
        console.log(err)
        res.status(400).json(err)
    }
});

app.get("/allMessages", (req, res) => {
    const { channelId } = req.query;
    // const messages = []
    try {
        db.query(`SELECT messages.id, messages.text, messages.sender_id, users.name as sender, messages.parent_id, messages.created_at
        FROM messages
        INNER JOIN users ON messages.sender_id = users.id 
        WHERE channel_id = ?`,
            [channelId], (err, rows, result) => {
                if (err) throw err;
                const messages = [...rows]

                rows.forEach(message => {
                    if (message.parent_id) {
                        const parent = messages.find(m => m.id === message.parent_id)
                        if (parent) {
                            parent.replies = parent.replies || []
                            parent.replies.push(message)
                        }
                    }
                })
                res.send(messages.filter(m => !m.parent_id));
            })

    } catch (err) { console.log(err) }
});

app.post("/createMessage", (req, res) => {
    const { message, sender, channelId, parentId } = req.body;
    try {
        db.query(`INSERT INTO messages (text, sender_id, channel_id, parent_id) VALUES (?, ?, ?, ?)`, [message, sender, channelId, parentId], (err, rows) => {
            if (err) throw err;
            db.query("SELECT * FROM messages WHERE id = LAST_INSERT_ID()", (err, rows, result) => {
                if (err) throw err;
                res.send(rows[0]);
            })
            // res.send(`New message sent to channelId: '${channelId}'`);
        })
    } catch (err) { console.log(err) }
});

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});

