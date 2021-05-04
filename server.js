const http = require('http');
const fs = require('fs');
const { parse } = require('querystring');
const mongoose = require('mongoose');

// Db work

const db = mongoose.connect('mongodb+srv://drcyberx:drcyberx@cluster0.yyra3.mongodb.net/myFirstDatabase')
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const loginUserSchema = new mongoose.Schema({
	Email: {
		type: String
	},
	Password: {
		type: String
	}
});

const loginUserModel = mongoose.model('userAuthData', loginUserSchema);

const hostname = '127.0.0.1';
const port = 3000;

// Node work

const Home = fs.readFileSync('./pages/LandingPage.html')
const signin = fs.readFileSync('./pages/signIn.html')
const signup = fs.readFileSync('./pages/signup.html')
const content = fs.readFileSync('./pages/mainContent.html')


const server = http.createServer((req, res) => {

	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/html');

	// main code
	if (req.url === '/') {
		res.end(Home);
	}

	// login 

	if (req.url === '/login') {
		if (req.method === 'POST') {
			let body = '';
			req.on('data', chunk => {
				body += chunk.toString(); // convert Buffer to string
			});
			req.on('end', () => {
				const Email = parse(body).email
				const Password = parse(body).password

				const user = {
					Email: Email,
					Password: Password
				}

				loginUserModel.findOne({ Email: Email }, function (err, data) {
					if (data) {
						res.end(content)
					} else {
						console.log('Account not found')
					}
				});
			});
		} else {
			res.end(signin);
		}
	}


	if (req.url === '/register') {
		if (req.method === 'POST') {
			let body = '';
			req.on('data', chunk => {
				body += chunk.toString(); // convert Buffer to string
			});
			req.on('end', () => {
				const Email = parse(body).email
				const Password = parse(body).password

				const user = {
					Email: Email,
					Password: Password
				}

				loginUserModel.findOne({ Email: Email }, function (err, data) {
					if (!data) {
						if (Email.length < 5) {
							console.log('Email or password must be valid ')
						} else {
							loginUserModel.insertMany(user, function (error, found) {
							})
						}
						res.end(content)
					} else {
						console.log('Record already exist')
						// res.end(signin);
					}
				});
			});
		} else {
			res.end(signup);
		}
	}else{
		res.end(Home)
	}


});

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});