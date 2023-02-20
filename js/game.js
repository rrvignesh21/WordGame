import { popMessage,confirmation } from "./modal.js";
import { getRoomData, updateScoreRoom, updateWord, generateRandomWord, getDefinitionOfWord,logout } from "./ajax.js";

let word;
let score;
let chances
let socket;

if (!sessionStorage.getItem("currentroomid")) {
    loadXML();
    score = 0;
    chances=5;
}
else {
    loadRoomData(sessionStorage.getItem("currentroomid"));
    socket = new WebSocket("ws://localhost:8080/WordGame/Socket");
    score = 0;
}

$(document).ready(function (){

    if(sessionStorage.getItem("id") < 0 | sessionStorage.getItem("id") == null){
        alert("You can't access this page");
        location.replace("../index.html"); 
    }

    if (sessionStorage.getItem("username") == "undefined" | sessionStorage.getItem("username") == null) {
        $("#welcome").text("Welcome , Guest");
        $("#logout").text("Back");
        $("#chatbox").hide();
    }
    else {
        if (!sessionStorage.getItem("currentroomid")) {
            $("#chatbox").hide();
            $("#chances").val(chances);
            $("#welcome").text("Welcome , " + sessionStorage.getItem("username"));
            $("<input id='profile' type='button' value='My Profile'>").appendTo("#buttons");
            $("<input id='createroom' type='button' value='Create Room'>").appendTo("#buttons");
            $("<input id='joinroom' type='button' value='Join A Room'>").appendTo("#buttons");
            if (sessionStorage.getItem("adminstatus") == "true") {
                $("<input id='leaderboard' type='button' value='User Manage'>").appendTo("#buttons");
            }
        }
        else {
            $("#chatbox").show();
            $("#logout").text("Back");
            console.log("Entered A Room Id : " + sessionStorage.getItem("currentroomid"));
            socket.onopen = function (event) {
                console.log("WebSocket is open now.");
                socket.send("roomname:" + sessionStorage.getItem("currentroomid"));
                socket.send(sessionStorage.getItem("currentroomid") + "-" + sessionStorage.getItem("username") + " Joined this room");
                socket.onclose = function (event) {
                    socket.send(sessionStorage.getItem("currentroomid") + "-" + sessionStorage.getItem("username") + " leaved this room");
                    console.log("WebSocket is closed now.");
                };
            };
            socket.onmessage = function(event) {
                if (event.data.split(" ")[1] == "Win") {
                    if(sessionStorage.getItem("currentroomuserid") == sessionStorage.getItem("id")){
                        $("<p>" + event.data + "</p>").appendTo("#chatbox");
                    }
                    else{
                        popMessage(event.data, function (confirm) {
                            if (confirm) {
                                $("<p>" + event.data + "</p>").appendTo("#chatbox");

                            }
                        });
                    }
                }
                else if(event.data == "changed"){
                    popMessage("Word Changed",function(confirm){
                        if(confirm){
                            $("#wrongguess").val("");
                            $("#chances").css('border-color', 'black');
                            loadRoomData(sessionStorage.getItem("currentroomid"));
                        }
                    });
                }
                else{
                    let message = event.data.split(" ");
                    console.log(message);
                    if(message[0] == sessionStorage.getItem("username") | !sessionStorage.getItem("currentroomuserid") == sessionStorage.getItem("id")){
                        message[0] = "You";
                        $("<p>" + message.join(" ") + "</p>").appendTo("#chatbox");
                    }
                    else{
                        $("<p>" + event.data + "</p>").appendTo("#chatbox");
                    }
                }
                console.log(event.data);
            };

            if(sessionStorage.getItem("currentroomuserid") == sessionStorage.getItem("id")){
                $("<input id='wordlength' placeholder='Enter Length of word' type='number'>").appendTo("#roombtn");
                $("<input id='generateword' type='button' value='Generate Word'>").appendTo("#roombtn");
                $("#input").hide();
                $("#guess").hide();
            }
        }

        if (sessionStorage.getItem("selected user")) {
            sessionStorage.removeItem("selected user");
        }
    }

    if (sessionStorage.getItem("mode")) {
        if (sessionStorage.getItem("mode") == 0) {
            document.getElementById("body").id = "body-dark";
            document.getElementById("mainbox").id = "mainbox-dark";
            document.getElementById("chances").classList.add("chances-dark");
            document.getElementById("wrongguess").classList.add("wrongguess-dark");
        }
    }

    $("#generateword").click(function(){
        generateRandomWord($("#wordlength").val()).then(function(word){
            $("#wordlength").val('');
            getDefinitionOfWord(word[0]).then(function(definition){
                let result = JSON.parse(definition);
                if(!definition){
                    document.getElementById("generateword").click();
                }
                else{
                    console.log(result);
                    let wordlist = word[0] + ":" + result["results"][0]["lexicalEntries"][0]["entries"][0]["senses"][0]["definitions"][0];
                    console.log(wordlist);
                    confirmation("New Word : " + word[0]).then(function(confirm){
                        if(confirm){
                            updateWord(sessionStorage.getItem("currentroomid"),wordlist).then(function(data){
                                if(data){
                                    socket.send( sessionStorage.getItem("currentroomid")+ "-" + "changed");
                                }
                            });
                        }
                        else{
                            console.log("sdhc");
                        }
                    });
                }
            });
        });
    });

    $("#logout").click(function (){
        if (!sessionStorage.getItem("currentroomid")) {
            sessionStorage.clear();
            logout().then(function(data){
                if(data){
                    location.replace("../index.html");
                }
            });
        }
        else {
            if(sessionStorage.getItem("currentroomuserid") == sessionStorage.getItem("id")){
                location.replace("../html/createRoom.html");
            }
            else{
                location.replace("../html/room.html");;
            }
        }
    });

    $("#profile").click(function () {
        sessionStorage.setItem("from", true);
        window.location.replace("../html/myprofile.html");
    });

    $("#createroom").click(function () {
        location.replace("../html/createRoom.html");
    });

    $("#joinroom").click(function () {
        location.replace("../html/room.html");
    });

    $("#leaderboard").click(function () {
        sessionStorage.setItem("from", true);
        location.replace("../html/leaderboard.html");
    });

    $("#guess").click(function () {
        if (!$("#input").val() == "" && sessionStorage.getItem("currentroomid")) {
            socket.send(sessionStorage.getItem("currentroomid") + "-" + sessionStorage.getItem("username") + " guessed letter :" + $("#input").val());
        }
        guess();
    });

    input.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            document.getElementById("guess").click();
        }
    });
});

function guess() {
    if ($("#input").val() == "") {

    }
    else if (word.includes($("#input").val())) {
        $("#" + word.indexOf($("#input").val())).text(word[word.indexOf($("#input").val())]);
        word[word.indexOf($("#input").val())] = "-1";
        score = score + 1;
        $("#score").text("Score : " + score);
    }
    else {
        $("#chances").val($("#chances").val() - 1);
        $("#chances").css('border-color', 'red');

        if ($("#wrongguess").val() == "") {
            $("#wrongguess").val($("#input").val());
        }
        else {
            $("#wrongguess").val($("#wrongguess").val() + "," + $("#input").val());
        }
    }

    $("#input").val('');
    if (score == word.length) {
        sessionStorage.setItem("points", parseInt(sessionStorage.getItem("points")) + 1);
        if (!sessionStorage.getItem("currentroomid")) {
            $.ajax({
                url: "../ScoreUpdate",
                method: "post",
                data: {
                    id: sessionStorage.getItem("id")
                },
                success: function (data) {
                    console.log(data);
                },
                error: function (err) {
                    alert("Error Occurs!" + err);
                    console.log(err);
                }
            });
        }
        else {
            updateScoreRoom(sessionStorage.getItem("id"), sessionStorage.getItem("currentroomid"));
        }
        popMessage("You Win!", function () {
            if(sessionStorage.getItem("currentroomuserid")){

                socket.send(sessionStorage.getItem("currentroomid") + "-" + sessionStorage.getItem("username") + " Win !");
            }
            else{
                location.reload();
            }
        });
    }
    if (parseInt($("#chances").val()) == 0) {
        popMessage("You Lose! Try Again", function () {
            if (!sessionStorage.getItem("currentroomid")) {
                location.reload();
            }
            else {
                console.log(parseInt(sessionStorage.getItem("chances")));
                score = 0;
                chances = parseInt(sessionStorage.getItem("chances"));
                $("#chances").css('border-color', 'black');
                $("#chances").val(chances);
                loadRoomData(sessionStorage.getItem("currentroomid"));
                console.log("Entered A Room Id : " + sessionStorage.getItem("currentroomid"));
            }
        });
    }
}

function loadXML() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            let words = this.responseXML.getElementsByTagName("data");
            let index = Math.floor(Math.random() * words.length);
            word = words[index].getElementsByTagName("word")[0].childNodes[0].nodeValue;
            word = word.split('');
            $("#hint").text("Hint : " + words[index].getElementsByTagName("hint")[0].childNodes[0].nodeValue);
            for (let i = 0; i < word.length; i++) {
                $("<div class = squares id =" + i + "></div>").appendTo("#word");
            }
        }
    }
    xhttp.open("POST", "../files/wordlist.xml", true);
    xhttp.send();
}

function loadRoomData(roomid) {
    getRoomData(roomid).then(function (data) {
        deleteChild();
        let room = JSON.parse(data);
        console.log(room);
        let words = room["wordlist"].split(":");
        word = words[0];
        console.log(word);
        word = word.split('');
        console.log(word);
        $("#welcome").text("Welcome , " + sessionStorage.getItem("username") + " to room : " + room["roomname"]);
        $("#chances").val(room["chances"]);
        chances = room["chances"];
        sessionStorage.setItem("chances", room["chances"]);
        $("#hint").text("Hint : " + words[1]);

        if(sessionStorage.getItem("currentroomuserid") == sessionStorage.getItem("id")){
            console.log("JABd");
            for (let i = 0; i < word.length; i++) {
                $("<div class = squares id =" + i + ">"+ word[i] +"</div>").appendTo("#word");
            }
        }
        else{
            console.log("JABd->2");
            for (let i = 0; i < word.length; i++) {
                $("<div class = squares id =" + i + "></div>").appendTo("#word");
            }
        }
    });
}

function deleteChild() {
    let e = document.getElementById("word");        
    let child = e.lastElesmentChild;
    
    while (child) {
        console.log(child);
        e.removeChild(child);
        child = e.lastElementChild;
    }
    e.innerHTML = "";
}