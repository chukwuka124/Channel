"use strict"

const express = require('express');
const cors = require('cors');
const { db, connectToDB } = require('./db');
const PORT = 8080
const http = require('http');
const corsOptions = { origin: `*` };

const app = express();
app.use(cors(corsOptions));
app.use(express.json())
const sockets = {};
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

const getAllMessages = (channelId) => {
    return new Promise(resolve => {
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
                    resolve(messages.filter(m => !m.parent_id))
                })
        } catch (err) {
            console.log(err)
        }
    })
}

app.post("/createMessage", (req, res) => {
    const { message, sender, channelId, parentId, name } = req.body;
    const socketIdsToEmit = []
    const keys = Object.keys(sockets)


    try {
        db.query(`INSERT INTO messages (text, sender_id, channel_id, parent_id) VALUES (?, ?, ?, ?)`, [message, sender, channelId, parentId],
            async (err, rows) => {
                if (err) throw err;
                db.query("SELECT * FROM messages WHERE id = LAST_INSERT_ID()", async (err, rows, result) => {
                    if (err) throw err;
                    for (let i = 0; i < keys.length; i++) {
                        const key = keys[i]
                        if (sockets?.[key] && key !== name) {
                            socketIdsToEmit.push(key)
                        }
                    }
                    const data = await getAllMessages(channelId)
                    console.log('socketId-->', socketIdsToEmit)
                    for (const socket_id of socketIdsToEmit) {
                        io.to(socket_id).emit('newMessage', data);
                    }
                    res.send(rows[0]);
                })
                // res.send(`New message sent to channelId: '${channelId}'`);
            })
    } catch (err) { console.log(err) }
});


const httpServer = http.createServer(app);
httpServer.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});

var io = require('socket.io')(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

try { connectToDB() }
catch (error) { }

io.on('connection', (socket) => {
    console.log(`Client connected: "${socket.id}"`);
    socket.on('join', ({ name, groupId }) => {
        console.log(`User "${name}" joined with socket id "${socket.id}"`);
        socket.join(name);
        sockets[name] = {
            socketId: socket.id,
            groupId: groupId,
        };
    });
});
