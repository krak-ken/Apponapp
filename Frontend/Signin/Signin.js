window.addEventListener("load", start);

let btn, email, password, errors, role;
let doctors, drivers, maids, barbers, lawyers;
let dropdown;

function start(){
    btn = document.querySelector("#SignIn");
    btn.addEventListener("click", submitForm);

    email = document.querySelector("#inputEmail");
    password = document.querySelector("#inputPassword");
    errors = document.querySelector("#Error");
    role = document.querySelector("#role");

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

function sendRequest(XHR, method, url, data) {
    XHR.onreadystatechange = function(){
        if (XHR.readyState == 4 && XHR.status == 200) {
            if(XHR.response){
                let res = JSON.parse(XHR.response);
                localStorage.setItem('token', res.token);
                localStorage.setItem('id',res.id);
                localStorage.setItem('name', res.name);
                localStorage.setItem('email', res.email);
                window.location = "../Homepage/Homepage.html";
            }
            else{
                console.log("sdvkdsaaaaa");
            }
        }
        else if (XHR.readyState == 4 && XHR.status == 400){
            errors.innerText = JSON.parse(XHR.response).error.message;
            errors.style.display = "block";
        }
        // else{
        //     window.location = "../Error/Error.html";
        // }
    };

    XHR.open(method, url);
    XHR.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    XHR.send(data);
}

function submitForm(e){
    e.preventDefault();
    if(email.value && password.value){
        let XHR = new XMLHttpRequest();
        let url, method, data;
        let js = {
            email: email.value,
            password: password.value
        };
        url = `http://localhost:8081/api/auth/signin/${role.value}`;
        method= 'POST';
        data = JSON.stringify(js);
        sendRequest(XHR, method, url, data);
    }
    else{
        errors.style.display = "block";
    }
}

function showProfess(e){
        window.location = `../Homepage/Homepage.html?q=${e.target.id}`;
}