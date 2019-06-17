const db = require("../db");
const format = require("pg-format");

exports.bookSlot = function(req, res, next){
    let {uid, profession, pid, slot} = req.params;
    let {cost, slotId} = req.body;
    let today = new Date();
    today = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
    slot = slot.split("-");
    let query_U = format("INSERT INTO timeslotsusers(profession, shift, cost, professionid, userid) values(%L ,'{%s, %s}', %L)", profession,slot[0], slot[1], [cost,pid,uid]);
    let tableName = "timeslot" + pid.replace(/-/g,"_");
    let query_P = format("update %s set shifts[1] = jsonb_set(shifts[1],'{IDS,%s}','\"%s\"') WHERE todaydate=%L", tableName, slotId, uid, today);

    (async () => {
    const client = await db.client.connect();
    try {
        await client.query('BEGIN');
        await client.query(query_U, []);
        await client.query(query_P, []);
        await client.query('COMMIT');
        res.status(200).send();
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
    })().catch(e => { console.error(e.stack); next(e)});
};

exports.deleteSlot = function(req, res, next){
    let {uid, profession, pid, slot} = req.params;
    let {today} = req.body;
    slot = slot.split("-");
    let slo = slot[0] + ":00";
    let query_U = format("DELETE FROM timeslotsusers WHERE userid=%L AND professionid=%L AND todaydate=%L AND shift[1]=%L", uid, pid, today, slo);
    let tableName = "timeslot" + pid.replace(/-/g,"_");
    let query_I = format("SELECT shifts FROM %s WHERE todaydate=%L",tableName,today);
    (async () => {
    const client = await db.client.connect();
    try {
        await client.query('BEGIN');
        let result = await client.query(query_I, []);
        let shift = result.rows[0].shifts[0];
        let st = shift['start'];
        let en = shift['end'];
        var dif = ( new Date("1970-1-1 " + en) - new Date("1970-1-1 " + st) ) / 1000 / 60;
        dif = dif/shift['No.'];
        st = st.toString();
        en = en.toString();
        dif.toString();
        dif = timeFromMins(dif);
        let slotId = slotNoRet(st, en, dif, slot);
        let query_P = format("update %s set shifts[1] = jsonb_set(shifts[1],'{IDS,%s}','\"1\"') WHERE todaydate=%L", tableName,slotId, today);
        await client.query(query_U, []);
        await client.query(query_P, []);
        await client.query('COMMIT');
        res.send();
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
    })().catch(e => { console.error(e.stack); next(e)});
};

exports.viewSP = function(req, res, next){
	let {uid, profession, pid} = req.params;
    let today = new Date();
    today = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
    let query_U = format("SELECT id, name, email, phone, address, expertise, rating, cost, description FROM %s WHERE id=%L", profession, pid);
    let tableName = "timeslot" + pid.replace(/-/g,"_");
    let query_P = format("SELECT * FROM  %s WHERE todaydate=%L", tableName, today);

    (async () => {
    const client = await db.client.connect();
    try {
        await client.query('BEGIN');
        let rowUser = await client.query(query_U, []);
        let rowProf = await client.query(query_P, []);
        await client.query('COMMIT');
        let obj = {
            ...rowProf.rows[0],
            ...rowUser.rows[0]
        }
        res.status(200).json(obj);
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
    })().catch(e => { console.error(e.stack); next(e)});
};

function timeFromMins(mins) {
    function z(n){return (n<10? '0':'') + n;}
    var h = (mins/60 |0) % 24;
    var m = mins % 60;
    return z(h) + ':' + z(m);
}

function uTime(time1, time2){
    let splitTime1= time1.split(':');
    let splitTime2= time2.split(':');
    let hour = parseInt(splitTime1[0])+parseInt(splitTime2[0]);
    let minute = parseInt(splitTime1[1])+parseInt(splitTime2[1]);
    hour = hour + minute/60;
    minute = minute%60;
    if(minute.toString().length < 2){
        minute += '0';
    }
    hour = parseInt(hour);
    if(hour.toString().length < 2){
        hour = '0' + hour;
    }
    return hour+':'+minute;
}

function slotNoRet(st, en, dif, slot){
        let i = 0;
        while(st != en){
            if(st.toString() == slot[0])
                return i;
            i++;
            st = uTime(st, dif);
        }
}