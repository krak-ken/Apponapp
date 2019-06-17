window.addEventListener("load", start);

let token;
let doctors, drivers, maids, barbers, lawyers;
let dropdown, cost;
let imgs = {
    doctors: '../Lib/images (1).jpg',
    drivers: '../Lib/driver.jpg',
    maids: '../Lib/maid.jpg',
    lawyers: '../Lib/lawyer.jpg',
    barbers: '../Lib/barber.jpg' 
};
let role;

function start(){
    token = localStorage.getItem("token");
    if(token){
        let nav = document.querySelector("ul.navbar-nav");
        let h = `<li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle text-white" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    ${localStorage.getItem('email')}
                    </a>
                    <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                        <a class="dropdown-item" href="../UserAccount/UserAccount.html">Account</a>
                        <a class="dropdown-item" href="#" onclick=logout()>Logout</a>
                    </div>
                </li>`;
        let parser = new DOMParser();
        let el = parser.parseFromString(h, "text/html");
        nav.append(el.body.firstChild);
    }
    else{
        window.location = "../Error/Error.html";
    }
    let Uid = localStorage.getItem("id");
    let params = (new URL(document.location)).searchParams;
    let id = params.get("id");
    role = params.get("role");
    let XHR = new XMLHttpRequest();
    let url, method, data;
    url = `http://localhost:8081/api/user/${Uid}/${role}/${id}`;
    method= 'GET';
    data = null;
    sendRequest(XHR, method, url, data, token);

    doctors = document.querySelector("#doctors");
    drivers = document.querySelector("#drivers");
    maids = document.querySelector("#maids");
    barbers = document.querySelector("#barbers");
    lawyers = document.querySelector("#lawyers");

    doctors.addEventListener("click", showProfess);
    drivers.addEventListener("click", showProfess);
    maids.addEventListener("click", showProfess);
    barbers.addEventListener("click", showProfess);
    lawyers.addEventListener("click", showProfess);

    dropdown = document.querySelectorAll(".dropdown-btn");

    for (i = 0; i < dropdown.length; i++) {
        dropdown[i].addEventListener("click", (e) => {
        e.target.classList.toggle("active");
        let dropdownContent = e.target.nextElementSibling;
        if (dropdownContent.style.display === "block") {
            dropdownContent.style.display = "none";
        } else {
            dropdownContent.style.display = "block";
        }
        });
    }
}

function setTokenHeader(xhr, token) {
    if(token){
        xhr.setRequestHeader('Authorization', `Bearer: ${token}`);
    }
    else{
        xhr.setRequestHeader('Authorization', null);
    }  
}

function logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    window.location = "../Homepage/Homepage.html";
}

function sendRequest(XHR, method, url, data, token) {
    XHR.onreadystatechange = function(){
        if (XHR.readyState == 4 && XHR.status == 200) {
            if(XHR.response){
                let res = JSON.parse(XHR.response);
                console.log(res);
                receiveResponse(res);
            }
            else{
                console.log("sdvkdsaaaaa");
                window.location.reload();
            }
        }
        else if (XHR.readyState == 4 && XHR.status != 200){
            console.log(XHR.responseText);
        }
    };

    XHR.open(method, url);
    setTokenHeader(XHR, token);
    XHR.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    XHR.send(data);
}

function receiveResponse(response){
    let main =  document.querySelector("#main");
    let spanstr;
    if(response.shifts){
        spanstr = createTime(response.shifts[0]);
    }
    let addr = response.address.substr(1).slice(0, -1).split(",");
        let html = ` <section>
        <div class="py-3">
        <div class="card">
            <div class="row">
                <div class="col-md-8 px-3">
                <div class="card-block px-3">
                    <h4 class="card-title">${response.name}</h4>
                    <p class="card-text" id="expertise">${response.expertise}</p>
                    <p class="card-text" id="description">${response.description}</p>
                    <p class="card-text" id="email">Email: ${response.email}</p>
                    <p class="card-text" id="phone">Phone: ${response.phone[0]}</p>
                    <p class="card-text" id="cost">Cost: ${cost = response.cost}</p>
                    <p class="card-text" id="rating">
                        <span class="fa fa-star checked"></span>
                        <span class="fa fa-star checked"></span>
                        <span class="fa fa-star checked"></span>
                        <span class="fa fa-star"></span>
                        <span class="fa fa-star"></span>
                    </p>
                    <p class="card-text" id="address">Address: ${addr[0]}, ${addr[1]}, ${addr[2]}, ${addr[3]}. Zipcode: ${addr[4]}</p>
                    <span id="time-Slots-Main" id="${response.id}">
                    ${spanstr}
                    </span>
                </div>
                </div>
                <div id="img-contain">
                    <img src="${imgs[role]}" class="w-100" id="card-img">
                </div>
            </div>
            </div>
        </div>
        </div>
    </section>`;
    let parser = new DOMParser();
    let el = parser.parseFromString(html, "text/html");
    main.append(el.body.firstChild);
}

function showProfess(e){
        let XHR = new XMLHttpRequest();
        let url, method, data;
        url = `http://localhost:8081/api/${e.target.id}`;
        method= 'GET';
        data = null;
        sendRequest(XHR, method, url, data, token);
}

function createTime(shift) {
    let str = "";
    let st = shift['start'];
    let en = shift['end'];
    var dif = ( new Date("1970-1-1 " + en) - new Date("1970-1-1 " + st) ) / 1000 / 60;
    dif = dif/shift['No.'];
    st = st.toString();
    en = en.toString();
    dif.toString();
    dif = timeFromMins(dif);
    console.log(dif);
    for(let i = 0; i < shift['No.']; i++){
        if(shift['IDS'][i] == 1){
            str += `<span id="time-Slots" class="avail" onclick=modal(this,${i}) data-toggle="modal" data-target="#exampleModalCenter">${st} - ${st = uTime(st, dif)}</span>`
        }
        else{
            str += `<span id="time-Slots" class="blocked">${st} - ${st = uTime(st, dif)}</span>`
        }
    }
    return str;
}
  
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
    return parseInt(hour)+':'+minute;
}

function book(e, slotId) {
    let v = e.innerText.split("-");
    let url, method, data;
    token = localStorage.getItem("token");
    let Uid = localStorage.getItem("id");
    let params = (new URL(document.location)).searchParams;
    let id = params.get("id");
    let role = params.get("role");
    let XHR = new XMLHttpRequest();
    url = `http://localhost:8081/api/user/${Uid}/${role}/${id}/book/${v[0]}-${v[1]}`;
    method= 'POST';
    data = {
        cost,
        slotId
    };
    data = JSON.stringify(data);
    sendRequest(XHR, method, url, data, token);
}

function modal(e, slotId) {
    let proc = document.querySelector("#proceed");
    let modalText = document.querySelector("#modal-body");

    modalText.innerText = `Proceed to Book.
                           Cost: ${cost}
                           Time: ${e.innerText}`;
    proc.addEventListener("click", () => { book(e, slotId) });
}


  

// update timeslot66c05c58_755e_43f1_9561_349361832d8a set shifts[1] = jsonb_set(shifts[1],'{IDS,0}','1') WHERE todaydate='2019-05-10';