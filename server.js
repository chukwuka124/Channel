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
            res.status(200).send(rows);
        })
    } catch (err) {
        console.log(err)
        res.status(400).json(err)
    }
});

app.post("/createChannel", (req, res) => {
    const { name } = req.body;
    try {
        db.query(`INSERT INTO channels (name) VALUES (?)`, [name])
        db.query("SELECT * FROM channels WHERE id = LAST_INSERT_ID()", (err, rows, result) => {
            if (err) throw err;
            res.status(200).send(rows[0]);
        })
        // res.send(`New channel '${name}' has been created`);
    } catch (err) {
        console.log(err)
        res.status(400).json(err)
    }
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
        db.query(`SELECT messages.id, messages.text, messages.sender_id, users.name as sender, messages.parent_id, messages.created_at, (SELECT JSON_ARRAYAGG(likes.user_id) FROM likes WHERE likes.message_id = messages.id) as likes, (SELECT JSON_ARRAYAGG(dislikes.user_id) FROM dislikes WHERE dislikes.message_id = messages.id) as dislikes
        FROM messages
        INNER JOIN users ON messages.sender_id = users.id 
        LEFT JOIN likes ON messages.id = likes.message_id
        LEFT JOIN dislikes ON messages.id = dislikes.message_id
        WHERE channel_id = ?
        GROUP BY messages.id`,
            [channelId], (err, rows, result) => {
                if (err) throw err;
                // const messages = [...rows]

                const messages = rows.map(message => {
                    if (message.parent_id) {
                        const parent = rows.find(m => m.id === message.parent_id)
                        if (parent) {
                            parent.replies = parent.replies || []
                            parent.replies.push(message)
                        }
                    }
                    if (message.likes !== null) {
                        const likes = JSON.parse(message.likes)
                        message.likes = likes
                    }
                    if (message.dislikes !== null) {
                        const dislikes = JSON.parse(message.dislikes)
                        message.dislikes = dislikes
                    }
                    return message
                })
                res.status(200).send(messages.filter(m => !m.parent_id));
            })

    } catch (err) {
        console.log(err)
        res.status(400).json(err)
    }
});

app.post("/createMessage", (req, res) => {
    const { message, sender, channelId, parentId } = req.body;
    try {
        db.query(`INSERT INTO messages (text, sender_id, channel_id, parent_id) VALUES (?, ?, ?, ?)`, [message, sender, channelId, parentId], (err, rows) => {
            if (err) throw err;
            db.query("SELECT * FROM messages WHERE id = LAST_INSERT_ID()", (err, rows, result) => {
                if (err) throw err;
                res.status(200).send(rows[0]);
            })
            // res.send(`New message sent to channelId: '${channelId}'`);
        })
    } catch (err) {
        console.log(err)
        res.status(400).json(err)
    }
});

app.patch("/incrementMessageLikes", (req, res) => {
    const { userId, messageId } = req.body;
    try {
        db.query(`UPDATE messages SET likes = likes + 1 WHERE id = ?`, [messageId], (err, rows) => {
            if (err) throw err;

            db.query(`INSERT INTO likes (user_id, message_id) VALUES (?, ?)`, [userId, messageId], (err, rows) => {
                if (err) throw err;
                return res.status(200).send({ message: 'Message liked' });
            });
        });
    } catch (err) {
        console.log(err)
        res.status(400).json(err)
    }
});

app.patch("/decrementMessageLikes", (req, res) => {
    const { userId, messageId } = req.body;
    try {
        db.query(`UPDATE messages SET likes = likes - 1 WHERE id = ?`, [messageId], (err, rows) => {
            if (err) throw err;

            db.query(`DELETE FROM likes WHERE message_id = ? AND user_id = ?`, [messageId, userId], (err, rows) => {
                if (err) throw err;
                return res.status(200).send({ message: 'Message unliked' });
            });
        });
    } catch (err) {
        console.log(err)
        res.status(400).json(err)
    }
});

app.patch("/incrementMessageDislikes", (req, res) => {
    const { userId, messageId } = req.body;
    try {
        db.query(`UPDATE messages SET dislikes = dislikes + 1 WHERE id = ?`, [messageId], (err, rows) => {
            if (err) throw err;

            db.query(`INSERT INTO dislikes (user_id, message_id) VALUES (?, ?)`, [userId, messageId], (err, rows) => {
                if (err) throw err;
                return res.status(200).send({ message: 'Message disliked' });
            });
        });
    } catch (err) {
        console.log(err)
        res.status(400).json(err)
    }
});

app.patch("/decrementMessageDislikes", (req, res) => {
    const { userId, messageId } = req.body;
    try {
        db.query(`UPDATE messages SET dislikes = dislikes - 1 WHERE id = ?`, [messageId], (err, rows) => {
            if (err) throw err;

            db.query(`DELETE FROM dislikes WHERE message_id = ? AND user_id = ?`, [messageId, userId], (err, rows) => {
                if (err) throw err;
                return res.status(200).send({ message: 'Message undisliked' });
            });
        });
    } catch (err) {
        console.log(err)
        res.status(400).json(err)
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});

