window.addEventListener("load", start);
let btn, token;
let doctors, drivers, maids, barbers, lawyers;
let imgs = {
    doctors: '../Lib/images (1).jpg',
    drivers: '../Lib/driver.jpg',
    maids: '../Lib/maid.jpg',
    lawyers: '../Lib/lawyer.jpg',
    barbers: '../Lib/barber.jpg' 
};
let dropdown;

function start(){
    token = localStorage.getItem("token");
    if(token){
        let nav = document.querySelector("ul.navbar-nav");
        let h = `<li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle text-white" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    ${localStorage.getItem('email')}
                    </a>
                    <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                        <a class="dropdown-item" href="#">Account</a>
                        <a class="dropdown-item" href="#" onclick=logout()>Logout</a>
                    </div>
                </li>`;
        let parser = new DOMParser();
        let el = parser.parseFromString(h, "text/html");
        nav.append(el.body.firstChild);
    }
    let XHR = new XMLHttpRequest();
    let url, method, data;
    url = `http://localhost:8081/api/users/${localStorage.getItem('id')}`;
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

function logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    window.location = "../Homepage/Homepage.html";
}

function setTokenHeader(xhr, token) {
    if(token){
        xhr.setRequestHeader('Authorization', `Bearer: ${token}`);
    }
    else{
        xhr.setRequestHeader('Authorization', null);
    }  
}

function sendRequest(XHR, method, url, data, token) {
    XHR.onerror = () => {
        window.location = '../Error/Error.html';
    };
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
        else if (XHR.readyState == 4 && XHR.status == 404){
            console.log(XHR.responseText);
            window.location = "../Error/Error.html";
        }
    };

    XHR.open(method, url);
    setTokenHeader(XHR, token);
    XHR.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    XHR.send(data);
}

function receiveResponse(response){
    let main =  document.querySelector("#main");
    console.log(response);
    if(response.length == 0){
        let html = `<section>
            <div class="py-3">
            <div class="card">
                <div class="row ">
                    <div class="col-md-8">
                    <div class="card-block p-3">
                        <h4 class="card-title">No Appointments Yet.....</h4>
                        <p class="card-text"></p>
                        <p class="card-text"></p>
                        <p class="card-text"></p>
                        <p class="card-text"></p>
                        <p class="card-text"></p>
                        <p class="card-text"></p>
                        </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </section>`;
        let parser = new DOMParser();
        let el = parser.parseFromString(html, "text/html");
        main.append(el.body.firstChild);
        return;
    }
        response.forEach((elem, i) => {
            let html = `<section id=${elem.id}>
            <div class="py-3">
            <div class="card">
                <div class="row ">
                    <div class="col-md-8">
                    <div class="card-block p-3" id="shift">
                        <h4 class="card-title">${elem.name}</h4>
                        <p class="card-text" >Profession: ${elem.profession}</p>
                        <p class="card-text" id="email">Email: ${elem.email}</p>
                        <p class="card-text" id="phone">Phone: ${elem.phone[0]}</p>
                        <p class="card-text">Date: ${elem.todaydate.slice(0,10)}</p>
                        <p class="card-text">Cost: ${elem.cost}</p>
                        <p class="card-text">Timing: ${elem.shift[0]} - ${elem.shift[1]}</p>
                        <a class='btn btn-danger text-white' id="bookASlot" onclick="modal(this,'${elem.todaydate.slice(0,10)}','${elem.profession}','${elem.professionid}', '${elem.shift}')" data-toggle="modal" data-target="#exampleModalCenter">Cancel Slot</a>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </section>`;
        let parser = new DOMParser();
        let el = parser.parseFromString(html, "text/html");
        main.append(el.body.firstChild);
    });
}

function showProfess(e){
        let XHR = new XMLHttpRequest();
        let url, method, data;
        url = `http://localhost:8081/api/${e.target.id}`;
        method= 'GET';
        data = null;
        sendRequest(XHR, method, url, data, token);
}

function cancel(e, today, role, pid,v) {
    let url, method, data;
    v = v.split(",");
    console.log(v);
    token = localStorage.getItem("token");
    let Uid = localStorage.getItem("id");
    let XHR = new XMLHttpRequest();
    url = `http://localhost:8081/api/user/${Uid}/${role}/${pid}/book/${v[0].slice(0,5)}-${v[1].slice(0,5)}`;
    method= 'DELETE';
    data = {
        today
    };
    data = JSON.stringify(data);
    sendRequest(XHR, method, url, data, token);
}

function modal(e, today, role, pid,v) {
    let proc = document.querySelector("#proceed");
    proc.addEventListener("click", () => { cancel(e, today, role, pid,v) });
}