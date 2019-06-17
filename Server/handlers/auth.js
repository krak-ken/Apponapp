const db = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
let roles = ['doctors','lawyers','maids','drivers','barbers'];
const format = require("pg-format");

exports.signin = async function(req, res, next){
    
	try{
		let table = req.params.role;
		if(roles.includes(table) || table == "users"){
			let {email, password: pass} = req.body;
			const query = `SELECT id, name, password FROM ${table} WHERE email=$1`;
			const values = [email];
			
			db.query(query, values)
				.then(async (result) => {
					if(result.rows[0]){
						let {id, name, password} = result.rows[0];
						let isMatch = await bcrypt.compare(pass, password);

						if(isMatch){
							let token = jwt.sign(
								{
									id,
									name,
									email
								},
								process.env.SECRET_KEY
								);
								return res.status(200).json({
									id,
									name,
									email,
									token
								});
						}
						else{
							return next({
								status: 400,
								message: "Invalid Email/Password."
							});
						}
					}else{
						return next({
							status: 400,
							message: "Invalid Email/Password."
						});
					}
					
				})
				.catch(err => {
					console.log(err);
					return next({
						status: 404
						
					});
				});
		}
		else{
			throw new Error();
		}
	} catch(err){
		return next({
			status: 404,
			message: err.message
		});
	}
};

exports.signup = async function(req, res, next){
	//implement Transaction for filling timeSlots make todayDate unique;
	try{
		let table = req.params.role;
		if(roles.includes(table)){
			let {name, email, phone, address, expertise, description, cost, password, shifts} = req.body;
			phone = JSON.parse(phone);
			address = `(${address.houseNo},${address.streetAddress},${address.city},${address.state},${address.zipcode})`;
			let hashedPassword = await bcrypt.hash(password, 10);
		
			const query = `INSERT INTO ${table} (name, email, phone, address, expertise, description, cost, password) VALUES($1,$2,$3,($4::addr),$5,$6,$7,$8) RETURNING id`;
			const values = [name, email, phone, address, expertise, description, cost, hashedPassword];
		
			db.query(query, values)
				.then(result => {
					let id = result.rows[0].id;
					let tableName = "timeslot" + id.replace(/-/g,"_");
					let queryValue = transformShifts(shifts, tableName);

					db.query(queryValue, [])
						.catch(err => {
							return next({
								status: 404
							});
						})

					let token = jwt.sign(
					{
						id,
						name,
						email
					},
					process.env.SECRET_KEY
					);
					return res.status(200).json({
						id,
						name,
						email,
						token
					});
				})
				.catch(err => {
					console.log(err);
					if(err.code == 23505){
						err.message = "Sorry, that email is taken";		
					}
					return next({
						status: 404,
						message: err.message
					});
				});
		}
		else if(table == "users"){
			let {name, email, phone, password} = req.body;
			phone = JSON.parse(phone);
			let hashedPassword = await bcrypt.hash(password, 10);
		
			const query = `INSERT INTO ${table} (name, email, phone, password) VALUES($1,$2,$3,$4) RETURNING id`;
			const values = [name, email, phone, hashedPassword];
		
			db.query(query, values)
				.then(result => {
					let id = result.rows[0].id;
					let token = jwt.sign(
					{
						id,
						name,
						email
					},
					process.env.SECRET_KEY
					);
					return res.status(200).json({
						id,
						name,
						email,
						token
					});
				})
				.catch(err => {
					console.log(err);
					if(err.code == 23505){
						err.message = "Sorry, that email is taken";		
					}
					return next({
						status: 404,
						message: err.message
					});
				});
		}
		else{
			throw new Error();
		}
	} catch(err){
		return next({
			status: 404
		});
	}	
};

function transformShifts(shifts, tableName) {
	let queryValue = `INSERT INTO ${tableName}(todayDate, shifts) VALUES`;
	
	shifts.forEach((element, i) => {
		let temp = [], row = [];
		row.push(...element.rows);
		temp.push(element.date);
		let query = format('(%L, ARRAY[%L]::json[])', temp, row);
		if( i != 0){
			queryValue += "," + query;
		}
		else
		queryValue += query;
	});
	return queryValue;
}
//http POST http://localhost:8081/api/auth/signup/doctors name='Anwesh' email='me@gmail.com' password='test' phone=[123456789] expertise='Orthopedic' description="15 years of experience, worken in AIIMS" cost=2000.00 address:=”{“”houseNo””:””B6-013””,””city””:””Bhubaneswar””,””state””:””Odisha””,””streetAddress””:””Maqbool Ganj””,””zipcode””:””175005””}” shifts:="[{""date"": ""2019-05-30"",""rows"":[{""start"":""9:00"",""end"":""17:00"",""No."":4,""IDS"":[1,1,1,1]}]}]"
//select (address).houseno from adwe;
// insert into timeslots(shifts) values(ARRAY['{"start" : "2:15","end" : "3:15","No.": 4,"IDS": [1, 1, 1, 1] }']::json[]);
//update timeslot66c05c58_755e_43f1_9561_349361832d8a set shifts[1] = jsonb_set(shifts[1],'{IDS,0}','1') WHERE todaydate='2019-06-10' 

//insert into timeslot50078960_4213_4e3c_9cb0_c9bb06e08a5f(shifts) values(ARRAY['{"start" : "2:15","end" : "3:15","No.": 4,"IDS": [1, 1, 1, 1] }']::jsonb[]);
//http POST http://localhost:8081/api/auth/signup/doctors name='Georgia' password='GKV35OUD3MH' email='nonummy.ac.feugiat@Nullaeuneque.ca' phone=[7556258978] expertise="eu lacus. Quisque imperdiet, erat" description="scelerisque sed, sapien. Nunc pulvinar arcu et pede. Nunc sed" cost=338 address:="{""houseNo"":""B6-015"",""city"":""Lucknow"",""state"":""UP"",""streetAddress"":""Indira Marker"",""zipcode"":""175005""}" shifts:="[{""date"":""2019-05-30"",""rows"":[{""start"":""9:00"",""end"":""17:00"",""No."":16,""IDS"":[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]}]}]"