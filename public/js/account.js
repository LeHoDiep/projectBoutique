import http from"./http.js";import getInforAccount from"./header.js";const changPasswordForm=document.querySelector("#account__form"),initInfor=(changPasswordForm.addEventListener("submit",async e=>{e.preventDefault();var e=document.querySelector("#account-phone").value,o=document.querySelector("#account-current-pwd").value,t=document.querySelector("#account-new-pwd").value,e=await http.send("POST","/api/change-infor",{newPhone:e,currentpwd:o,newpassword:t,token:localStorage.getItem("token")});return"ok"==e.status?(localStorage.removeItem("token"),document.querySelector(".account__block").style.display="block",document.querySelector(".infor-account__block").style.display="none",document.querySelector(".userName a").innerHTML="",window.location="../page/login.html",alert("Password is changed")):alert(e.error),e}),async()=>{var e=await getInforAccount();document.querySelector("#account-phone").value=e.phoneNumber,document.querySelector("#account-username").innerHTML=e.userid});initInfor();