import { createRoom,getUserRoom,deleteRoom,generateRandomWord,getDefinitionOfWord } from "./ajax.js";
import { confirmation, popMessage } from "./modal.js";

let room;

let wordlist;

$(document).ready(function(){

    if(sessionStorage.getItem("id") < 0 | sessionStorage.getItem("id") == null){
        alert("You can't access this page");
        location.replace("../index.html"); 
    }

    if(sessionStorage.getItem("mode")){
        console.log(sessionStorage.getItem("mode"));
        if(sessionStorage.getItem("mode") == 0){
            document.getElementById("body").id = "body-dark";
        }
    }

    $("#createroom").off('click').on('click',function(){
        $("#createroomform").modal();
    });

    $("#back").click(function() {
        sessionStorage.removeItem("currentroomid");
        sessionStorage.removeItem("currentroomuserid");
        sessionStorage.removeItem("currentroomname");
        location.replace("../html/game.html");
    });

    getUserRoom(sessionStorage.getItem("id")).then(function(data){
        room = JSON.parse(data);
        loadUserRoom(room);
    });

    $("#generateword").click(function(){
        generateRandomWord($("#wordlength").val()).then(function(word){
            console.log(word[0]);
            getDefinitionOfWord(word[0]).then(function(definition){
                let result = JSON.parse(definition);
                if(!definition){
                    document.getElementById("generateword").click();
                }
                else{
                    console.log(result);
                    $("#word").val(word[0]);
                    wordlist = $("#word").val() + ":" + result["results"][0]["lexicalEntries"][0]["entries"][0]["senses"][0]["definitions"][0];
                    console.log(result["results"][0]["lexicalEntries"][0]["entries"][0]["senses"][0]["definitions"][0]);
                }

            });
        });
    });

    $("#submit").click(function(){
        $("#createroomform").modal('hide'); 
        let userid = sessionStorage.getItem("id");
        let roomname = $("#roomname").val();
        let wordlist = $("#word").val();
        let chances = $("#chances").val();
        createRoom(userid,roomname,wordlist,chances).then(function(data){
            console.log(data);
            if(data){
                popMessage("Successfully Created a Room.",function(){
                    location.reload();
                });
            }
        });
    });
});

function loadUserRoom(data){
    for(let i = 0 ;i < data.length;i++){
        $("<div class = 'room'>"+
        "<h3>" + data[i]["roomname"] +"</h3>"
        +"<p><label>Chance : <lable>"+ data[i]["chances"] +"</p>"
        +"<p><label>No Of Players : <lable>"+ data[i]["noofplayers"] +"</p>"
        +"<p id= "+data[i]["roomid"]+"room> " 
        +" <span id= "+data[i]["roomid"]+"enter></span></p>"        
        +"</div>").appendTo("#createdroom");

        $("<button/>",{
            text : "Enter",
            class : "btn btn-primary",
            click : function(){
                sessionStorage.setItem("currentroomid",data[i]["roomid"]);
                sessionStorage.setItem("currentroomuserid",data[i]["userid"]);
                sessionStorage.setItem("currentroomname",data[i]["roomname"]);
                location.replace("../html/game.html");  
            }
        }).appendTo("#" + data[i]["roomid"] + "enter");

        $("<button/>",{
            text : "Delete",
            class : "btn btn-danger",
            click : function(){
                confirmation("Are You Sure You Want to Delete this room ? ").then(function(confirm){
                    if(confirm){
                        deleteRoom(data[i]["roomid"]);
                    }
                });
            }
        }).appendTo("#" + data[i]["roomid"] + "room");
    }
}