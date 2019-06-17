window.addEventListener("load", start);

let doctors, drivers, maids, barbers, lawyers;
let dropdown, obj={}, submit, roleProf;

function start(){

    doctors = document.querySelector("#doctors");
    drivers = document.querySelector("#drivers");
    maids = document.querySelector("#maids");
    barbers = document.querySelector("#barbers");
    lawyers = document.querySelector("#lawyers");
    submit = document.querySelector("#submit");
    roleProf = document.querySelector("#profession");

    doctors.addEventListener("click", showProfess);
    drivers.addEventListener("click", showProfess);
    maids.addEventListener("click", showProfess);
    barbers.addEventListener("click", showProfess);
    lawyers.addEventListener("click", showProfess);
    submit.addEventListener("click", onSubmit);
    roleProf.addEventListener("change", onRole);

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

function showProfess(e){
    window.location = `../Homepage/Homepage.html?q=${e.target.id}`;
}

function handleChange(e) {
    obj[e.name] = e.value;
  }

function onSubmit(e){
    e.preventDefault();
    let data = JSON.stringify(dataF());
    let XHR = new XMLHttpRequest();
    let url, method;
    url = `http://localhost:8081/api/auth/signup/${document.querySelector("#profession").value}`;
    method= 'POST';
    sendRequest(XHR, method, url, data);
}

function sendRequest(XHR, method, url, data) {
  XHR.onreadystatechange = function(){
      if (XHR.readyState == 4 && XHR.status == 200) {
          if(XHR.response){
              let res = JSON.parse(XHR.response);
              localStorage.setItem('token', res.token);
              localStorage.setItem('name', res.name);
              localStorage.setItem('email', res.email);
              localStorage.setItem('id', res.id);
              window.location = `../Homepage/Homepage.html`;
              console.log(res);
          }
          else{
              console.log("sdvkdsaaaaa");
          }
      }
      else if (XHR.readyState == 4 && XHR.status != 200){
        window.location = `../Error/Error.html`;
      }
  };

  XHR.open(method, url);
  XHR.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  XHR.send(data);
}

function dataF(){
    let d = {};
    if(document.querySelector("#profession").value != "users"){
        let today = new Date();
    today = today.getFullYear() + "-" + today.getMonth() + "-" + today.getDate();
   let arr = [];
    for(let i=0;i<obj.noShifts;i++)
    {
      arr.push(1);
    }
    d = {
      name: obj.name,
      address: {
        houseNo: obj.houseNo,
        streetAddress: obj.streetAddress,
        city: obj.city,
        state: obj.state,
        zipcode: obj.zipcode
      },
      
      phone: JSON.stringify([obj.phone]),
      email: obj.email,
      expertise: obj.expertise,
      description: obj.description,
      cost: obj.cost,
      password: obj.password,
      profession: obj.role,
  
      shifts: [{
        date: today,
        rows: [{
          start: obj.startShift,
          end: obj.endShift,
          "No.": obj.noShifts,
          IDS: arr,
        }]
      }]
    };
    }
    else{
        d = {
            name: obj.name,
            phone: JSON.stringify([obj.phone]),
            email: obj.email,
            password: obj.password
          };
    }
    return d;
  }

  function onRole(e){
      if(e.target.value != "users"){
        document.querySelector("#RolePlaying").style.display = "block";
      }
      else{
        document.querySelector("#RolePlaying").style.display = "none";
      }
  }
