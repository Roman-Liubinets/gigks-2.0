const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mysql = require('mysql');
const PORT = 8000;
const multer = require("multer");

app.use(express.static(__dirname + "/public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	"extended": "true"
}));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'giks'
});

//Створення таблиці юзерів
//let usersDb = function () {
//    connection.query('' +
//        'CREATE TABLE IF NOT EXISTS users (' +
//        'id int(11) NOT NULL AUTO_INCREMENT,' +
//        'login varchar(50) NOT NULL, ' +
//        'password varchar(50) NOT NULL,' +
//        'email varchar(50) NOT NULL,' +
//        'name varchar(50), ' +
//        'sname varchar(50),' +
//        'bDay varchar(50),' +
//        'PRIMARY KEY(id),' +
//        'UNIQUE INDEX `login_UNIQUE` (`login` ASC))',
//        function (err) {
//            if (err) throw err;
//            console.log('CREATE TABLE IF NOT EXISTS users')
//        });
//};
//
//usersDb();

app.get("*",function (req, res) {
	res.sendFile(__dirname + "/public/index.html");
});

//Авторизація 
app.post('/login-auth', function (req, res) {
    connection.query('SELECT * FROM users  WHERE login = ?', req.body.login, function (err, rows) {
        if (err) throw err;
        if (rows[0] != undefined) {
            if (rows[0].password == req.body.password) {
                res.status(200).send("welcome");
            } else {
                res.status(200).send("wrong password");
            }
        } else {
            res.status(200).send("wrong login");
        }
    });
});

//Профіль користувача
app.post('/login-prof', function (req, res) {
    connection.query('SELECT * FROM users  WHERE login = ?', req.body.login, function (err, rows) {
        if (err) throw err;
        if (rows[0] != undefined) {
            connection.query('SELECT * FROM userpage WHERE users_id = ?', rows[0].id, function (err, resu) {
                if (err) throw err;
                if (resu[0] != undefined) {
                    res.status(200).send(resu);
                } else {
                    res.status(200).send("Profile is undefined!");
                }
            });
        } else {
            res.status(200).send("Profile is undefined!");
        }
    });
});


//Запус сервера
app.listen(PORT, function (err){
	if (err) throw err;
	console.log("Server start on port 8000!");
});
