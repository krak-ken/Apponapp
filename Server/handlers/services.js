const db = require("../db");
let roles = ['doctors','lawyers','maids','drivers','barbers'];
const format = require("pg-format");

exports.dashInfo = (req, res, next) => {
    let {role, uid} = req.params;
    let query, values=[uid];

    if(roles.includes(role)){
        let today = new Date();
        today = today.getFullYear() + "-" + today.getMonth() + "-" + today.getDate();
        let date = req.query.date || today;
        let tableName = "timeslot" + uid.replace(/-/g,"_");
        
        query = `SELECT * FROM ${tableName} WHERE todayDate=$1`;
        db.query(query, [date])
            .then(result => {
                let obj = {
                    start: result.rows[0].shifts[0].start,
                    end: result.rows[0].shifts[0].end,
                    id: result.rows[0].id,
                    date: result.rows[0].todaydate,
                    Num: result.rows[0].shifts[0]["No."],
                    Ids: result.rows[0].shifts[0].IDS
                };
                let arr = result.rows[0].shifts[0]['IDS'].filter(e => {
                    if(e!=1) return true;
                    else return false;
                })
                arr.forEach((e,i) => {
                        let q = `SELECT name, email FROM users WHERE id=$1`;
                        db.query(q, [e])
                            .then(resul => {
                                let {name, email} = resul.rows[0];
                                obj = {
                                    ...obj,
                                    [i]:{name, email, id: e}
                                };
                                if( i === arr.length - 1){
                                    return res.status(200).json(obj);
                                }
                            })
                            .catch(err => next(err));
                });
            })
            .catch(err => {
                next(err);
            });
    }
    else if(role == "users"){
        query = `SELECT * from timeslotsusers WHERE userid=$1`;
        db.query(query, values)
            .then(result => {
                result.rows.forEach((ele, i) => {
                    let q = `SELECT name, email, phone from ${ele.profession} where id=$1`
                    db.query(q, [ele.professionid])
                        .then(resu => {
                            let {name, email, phone} = resu.rows[0];
                            result.rows[i] = {
                                ...ele,
                                name,
                                todaydate: new Date(),
                                email,
                                phone
                            };
                            if( i === result.rows.length - 1){
                                return res.status(200).json(result.rows);
                            }
                        })
                        .catch(err => next(err))
                });
            })
            .catch(err => {
                next(err);
            });
    }
    else{
        return next({
			status: 404
		});
    }
    
}

exports.updateDashInfo = (req, res, next) => {
    let {role, uid} = req.params;
    let query;
    let col = Object.keys(req.body);
    let val = Object.values(req.body);
    if(roles.includes(role) || role == "users"){
        let q = "";
        col.forEach((e, i) => {
            if(i!=0){
                q += format(',%s=%s', e, val[i]);
            }else{
                q += format('%s=%s', e, val[i]);
            }    
        });
        query = `UPDATE ${role} SET ${q} WHERE id=$1`;
    }
    else{
        return next({
			status: 404
		});
    }
    db.query(query, [uid])
        .then(result => {
            return res.status(200).json(result.rows);
        })
        .catch(err => {
            next(err);
        });
}

exports.deleteUser = (req, res, next) => {
    let {role, uid} = req.params;
    let query, values=[uid];
    if(roles.includes(role) || role == "users"){
        query = `DELETE FROM ${role} WHERE id=$1`;
    }
    else{
        return next({
			status: 404
		});
    }
    db.query(query, values)
        .then(result => {
            return res.status(200).send();
        })
        .catch(err => {
            next(err);
        });
}

exports.filtersSP = (req, res, next) => {
    let {filter} = req.params;
    let {limit, sort} = req.query;
    if(filter == "all" ){
        let sr = {};
        roles.forEach((e, i) => {
            let tableName = e + "view";
            let query = `SELECT * FROM ${tableName} LIMIT 2 `;
            db.query(query, [])
                .then(result => {
                    sr[e] = [...result.rows];
                    
                    if( i === roles.length - 1){
                        return res.status(200).json(sr);
                    }
                })
                .catch(err => {
                    next(err);
                });  
        });
    }
    else if(roles.includes(filter)){
        let tableName = filter + "view";
        let values =[];
        let query = `SELECT * FROM ${tableName} ORDER BY $1, $2 LIMIT $3 `;
        if(sort){
            let i = Object.keys(sort)[0];
            values = [i || 'id', sort[i] || 'ASC', parseInt(limit, 10) || 5];
        }
        else{
            values = ['id','ASC', parseInt(limit, 10) || 5];
        }
        let sr = {}
        db.query(query, values)
            .then(result => {
                sr[filter] = [...result.rows];
                return res.status(200).json(sr);
            })
            .catch(err => {
                next(err);
            });  
    }
    else{
        return next({
			status: 404
		});
    }
}

//update timeslot50f2c7c2_9202_49df_b625_2836bb70cbc2 set shifts[1] = jsonb_set(shifts[1],'{IDS,0}','"262a8c36-cbd4-4f06-9e6b-58c62bfdebf1"');
//http PUT http://localhost:8081/api/users/18eb43ec-bc01-4209-88e5-d89bffb7250f "Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE4ZWI0M2VjLWJjMDEtNDIwOS04OGU1LWQ4OWJmZmI3MjUwZiIsIm5hbWUiOiInQW53ZXNoJyIsImVtYWlsIjoiJ21lQGdtYWlsLmNvbSciLCJpYXQiOjE1NTkwMzQyNTh9.BexPDe7OtIdYxuO35thhBuQAhlYIlMs6RZiKFFY4-zE" name='Atyant' email='me2@gmail.com' phone='{1234,7544,3423}'