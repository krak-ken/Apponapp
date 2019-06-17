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
        removeElems(nav);
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
    let XHR = new XMLHttpRequest();
    let url, method, data;
    url = `http://localhost:8081/api/all`;
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
    window.location.reload();
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
    removeElems(main);
    let res = Object.keys(response);
    res.forEach(e => {
        response[e].forEach((elem, i) => {
            let html = `<section id=${elem.id}>
            <div class="py-3">
            <div class="card">
                <div class="row ">
                <div class="col-md-3">
                    <img src="${imgs[e]}" class="w-100" id="card-img">
                    </div>
                    <div class="col-md-8 px-3">
                    <div class="card-block px-3">
                        <h4 class="card-title">${elem.name}</h4>
                        <p class="card-text">${format(elem.expertise, 40)}</p>
                        <p class="card-text">${format(elem.description, 170)}</p>
                        <p class="card-text">EMAIL: ${elem.email}</p>
                        <p class="card-text">PHONE: ${elem.phone[0]}, ${elem.phone[1]}</p>
                        <a class='btn btn-success text-white' id="bookASlot" onclick="showDetail('${elem.id}','${e}')">Book A Slot</a>
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
    });
}

function format(string, num){
    if(string.length <= num){
        return string;
    }
    else{
        return string.substr(0, num) + "...";
    }
}

function showDetail(id, role){
        if(token){
            let url = `../Dashboard/Dashboard.html?id=${id}&role=${role}`;
            window.location = url;
        }
        else{
            window.location = "../Signin/Signin.html"
        }
}

function showProfess(e){
        let XHR = new XMLHttpRequest();
        let url, method, data;
        url = `http://localhost:8081/api/${e.target.id}`;
        method= 'GET';
        data = null;
        sendRequest(XHR, method, url, data, token);
}

function removeElems(main) {
    let child = main.lastElementChild;  
    while (child) { 
        main.removeChild(child); 
        child = main.lastElementChild; 
    } 
}