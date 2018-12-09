var report = function(kilometers, miles){
    document.getElementById("result").innerHTML = 
            kilometers + "\km = " + miles + "\mi";
}; 
document.getElementById("km_to_mi").onclick = function(){
    var km = document.getElementById("miles").value;
    report(km, km/1.6);
};
document.getElementById("mi_to_km").onclick = function(){
    var mi = document.getElementById("miles").value;
    report(mi * 1.6, mi);
};
function openPage(event, tabName) {
    var i, tabcontent, tablinks;
	
    tabcontent = document.getElementsByClassName("content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
	
    tablinks = document.getElementsByClassName("tabLink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
	
    document.getElementById(tabName).style.display = "block";
    event.currentTarget.className += " active";
}

function openNav(){
	document.getElementById("mainNav").style.width = "250px";
	document.getElementById("mainPage").style.marginLeft = "250px";
}

function closeNav(){
	document.getElementById("mainNav").style.width = "0";
	document.getElementById("mainPage").style.marginLeft = "0";
}

document.getElementById("defaultOpen").click();

$(document).ready(function (){
	
});