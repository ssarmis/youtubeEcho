const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const http = require('http');

module.exports = function(passport){
	passport.use(new LocalStrategy((username, password, done) => {
			let inputData = {email:username};
			inputData = JSON.stringify(inputData);
			
			let options = {
				host: "localhost", // change for laptop
				port: 8080,
				path: "/test/getUserData",
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Content-Length": Buffer.byteLength(inputData)
				}
			}

			var request = new http.request(options, res => {
				//console.log(`Status: ${res.statusCode}`);
				res.setEncoding('utf-8');
				
				if(res.statusCode == 403){
					console.log("Wrong user/password");
					return;
				}
				
				res.on('data', chunk => {
					//console.log(`Body: ${chunk}`);
					let data = JSON.parse(chunk);
					
					bcrypt.compare(password, data.password, (err, isMatch) => {
						if(err){
							console.log(err);
							return;
						}
						
						if(isMatch){
							return done(null, data);
						} else {
							return done(null, false, {message: "Wrong user/password"});
						}
					});
					
					
				});
				
				res.on('end', () => {
					//console.log("End of data");
				});
			});
			
			request.on('error', err => {
				console.log(`Error: ${err.message}`);
			});
			
			request.write(inputData);
			request.end();
	}));
		
	passport.serializeUser((user, done) => {
		done(null, user.email);
	});

	passport.deserializeUser( (username, done) => {
		let inputData = {email: username};
			inputData = JSON.stringify(inputData);
			
			let options = {
				host: "localhost", // change on laptop
				port: 8080,
				path: "/test/getUserData",
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Content-Length": Buffer.byteLength(inputData)
				}
			}

			var request = new http.request(options, res => {
				//console.log(`Status: ${res.statusCode}`);
				res.setEncoding('utf-8');
				
				res.on('data', chunk => {
					//console.log(`Body: ${chunk}`);
					//console.log(chunk);
					let data = JSON.parse(chunk);
					return done(null, data);
				});
				
				res.on('end', () => {
					//console.log("End of data");
				});
			});
			request.on('error', err => {
				console.log(`Error: ${err.message}`);
			});
			
			request.write(inputData);
			request.end();
	});
};