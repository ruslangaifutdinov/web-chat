var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var upload = require('express-fileupload');

server.listen(3000);

app.use(express.static(__dirname));
app.use(upload());

app.get('/', function(request, respons) {
	respons.sendFile(__dirname + '/src/index.html');
});

connections = [];
var arr = [];

app.post('/', function (req, res) {
    let yourid = req.query.yourid;
    if(req.files) {
        var filename = req.files.file.name;
        req.files.file.mv("./src/img/"+filename, function (err) {
            if(err) {
                console.log(err);
                res.send("error occured")
            } else {
                res.send("Done!")
                //Если уже есть такой номер
                if(clients[yourid]) {
                    clients[yourid].push(filename);
                } else { //Если нет, то создаем пустой массив и пушим
                    clients[yourid] = [];
                    clients[yourid].push(filename);
                }

                console.log("Клиенты",clients);
            }
        })


    }
})

io.sockets.on('connection', (socket) => {
	var name = 'U' + (socket.id).toString().substr(1,4);
	console.log(name + ": is online");
	socket.broadcast.emit('newUser', name);
	socket.emit('userName', name);
	console.log("Успешное соединение");

	connections.push(socket);
	arr.push(name);
	console.log(arr);

	// Функция, которая срабатывает при отключении от сервера
	socket.on('disconnect', (data) => {
		console.log(name + ": is OFFline");
		// Удалениe пользователя из массива
		connections.splice(connections.indexOf(socket), 1);
		
		 var index = arr.indexOf(name);
		 if (index > -1) {
		 	arr.splice(index, 1);
		 }
		 console.log(arr);
	});

	// Функция получающая сообщение от какого-либо пользователя
	socket.on('new_mess', (data) => {
		console.log(data);

		// Внутри функции мы передаем событие 'add mess',
		// которое будет вызвано у всех пользователей и у них добавиться новое сообщение 
		io.sockets.emit('new_mess', 
		{
			mess: data.mess,
			date: data.date,
			username: data.username,
			userid: data.userid,
			arr: arr
		});
	});

	socket.on('new_person', (data) => {
		console.log(data);

		// Внутри функции мы передаем событие 'add mess',
		// которое будет вызвано у всех пользователей и у них добавиться новое сообщение 
		io.sockets.emit('new_person', 
		{
			username: data.username,
			userid: data.userid
		});
	});
});