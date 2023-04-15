const mysql = require('mysql');

var connection = mysql.createConnection({
    host: "mysql1",
    port: "3306",
    user: "root",
    password: "admin",
    multipleStatements: true
});


const connectToDB = () => {
    connection.connect((err) => {
        connection.query("CREATE DATABASE IF NOT EXISTS channel_project", (err) => {
            if (err) {
                console.log("Error creating database!", err);
                return
            }
            connection.query(`USE channel_project`, (err) => {
                if (err) {
                    console.log("Error using database!", err);
                    return
                }
                // connection.query("DROP TABLE IF EXISTS channels", (err) => {
                //     if (err) throw (err);
                // });
                connection.query(`CREATE TABLE IF NOT EXISTS channels(
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        name VARCHAR(255) NOT NULL
                    )`, (err) => {
                    if (err) {
                        console.log("Error creating table 'channels' !", err);
                        return
                    }
                    console.log('Table "channels" created!');
                });

                connection.query(`CREATE TABLE IF NOT EXISTS messages(
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        text VARCHAR(255) NOT NULL,
                        sender_id INT NOT NULL,
                        channel_id INT NOT NULL,
                        parent_id INT,
                        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        likes INT DEFAULT 0,
                        dislikes INT DEFAULT 0,
                        FOREIGN KEY (channel_id) REFERENCES channels(id)
                    )`, (err) => {
                    if (err) {
                        console.log("Error creating table 'messages' !", err);
                        return
                    }
                    console.log('Table "messages" created!');
                });

                connection.query(`CREATE TABLE IF NOT EXISTS users(
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        name VARCHAR(255) NOT NULL,
                        password VARCHAR(255) NOT NULL
                    )`, (err) => {
                    if (err) {
                        console.log("Error creating table 'users' !", err);
                        return
                    }
                    console.log('Table "users" created!');
                });

                connection.query(`CREATE TABLE IF NOT EXISTS likes(
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        user_id INT NOT NULL,
                        message_id INT NOT NULL,
                        FOREIGN KEY (user_id) REFERENCES users(id),
                        FOREIGN KEY (message_id) REFERENCES messages(id)
                    )`, (err) => {
                    if (err) {
                        console.log("Error creating table 'likes' !", err);
                        return
                    }
                    console.log('Table "likes" created!');
                });

                connection.query(`CREATE TABLE IF NOT EXISTS dislikes(
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        user_id INT NOT NULL,
                        message_id INT NOT NULL,
                        FOREIGN KEY (user_id) REFERENCES users(id),
                        FOREIGN KEY (message_id) REFERENCES messages(id)
                    )`, (err) => {
                    if (err) {
                        console.log("Error creating table 'dislikes' !", err);
                        return
                    }
                    console.log('Table "dislikes" created!');
                });
            });
        });
    });
}

module.exports = { db: connection, connectToDB };