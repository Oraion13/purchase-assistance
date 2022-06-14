

const login=document.getElementById("login");
const loginbtn=document.getElementById("loginBtn");

const reset=document.getElementById("reset");
reset.style.display="none";

function forgetpwToReset(){
    reset.style.display="block";
    login.style.display="none";
}

const otp=document.getElementById("otp");
otp.style.display="none";
function resetToOtp(){
    otp.style.display="block";
    reset.style.display="none"; 
}

const recreate=document.getElementById("recreate");
recreate.style.display="none";
function otpToRecreate(){
    recreate.style.display="block";
    otp.style.display="none";
}
function toLogin(){
    recreate.style.display="none";
    login.style.display="block";
}
const status=document.getElementById("search");
search.style.display="none";
const sts=document.getElementById("sts");
// sts.addEventListener('click' , () => {
//     search.style.display="block";
// })

