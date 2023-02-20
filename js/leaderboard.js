import { loadScoreBoard,ChangePassword,resetScore,removeUser,revokeAdmin,makeAdmin,search,loadRoomScoreBoard } from "./ajax.js";
import { confirmation,popMessage,getPassword } from "./modal.js";

let currentpage = 1;
let itemperPage = 5;
let numberOfPages;
let numberOfSelectedUser = 0;
let scores;

$(document).ready(function(){
    if(sessionStorage.getItem("id") < 0 | sessionStorage.getItem("id") == null){
        console.log("1 Here");
        popMessage("You can't access this page",function(){
            location.replace("../index.html"); 
        });
    }
    else if((sessionStorage.getItem("adminstatus") == "false" & !sessionStorage.getItem("currentroomid")) | !sessionStorage.getItem("from")){
        console.log("2 Here");
        popMessage("You can't access this page",function(){
            history.back();
        });
    }
    else if(sessionStorage.getItem("adminstatus") == "true" | sessionStorage.getItem("currentroomid")){

        console.log(sessionStorage.getItem("currentroomid"));
        if(!sessionStorage.getItem("currentroomid")){
            loadDefaultPage();
        }
        else{
            loadRoomScorePage();
        }
        $("#search").off('click').on('click',function(){
            search(1,$("#searchValue").val()).then(function(data){
                if(!$("#searchValue").val() == ""){
                    scores = JSON.parse(data);
                    if(scores.length > 0){
                        addPageNumber(scores);
                    }
                    else{
                        popMessage("Cannot find result related to \"" + $("#searchValue").val()+"\"");
                        $("#searchValue").val("");
                        loadDefaultPage();
                    }
                }
            });
        });

        document.getElementById("searchValue").addEventListener('input',function(event){
            search(0,event.target.value).then(function(data){
                if(!event.target.value == ""){
                    scores = JSON.parse(data);
                    if(scores.length > 0){
                        addPageNumber(scores);
                    }
                    else{
                        popMessage("Cannot find result related to \"" + event.target.value + "\"");
                        $("#searchValue").val("");
                        loadDefaultPage();
                    }
                }
                else{
                    loadDefaultPage();
                }
                
            });
        });

        if(!sessionStorage.getItem("currentroomid")){
        $("#selectAll").click(function(){
            if(!document.getElementById("selectAll").checked){
                let start = (currentpage - 1) * itemperPage;
                let currentPageData = scores.slice(start,start + itemperPage);
                let selected = sessionStorage.getItem( "selected user").split(",");
                for(let i = 0 ;i < currentPageData.length;i++){
                    console.log(currentPageData[i]["id"] + " Splice :  " + selected.indexOf(String(currentPageData[i]["id"])));
                    if(selected.indexOf(String(currentPageData[i]["id"])) >= 0){
                        let spliced = selected.splice(selected.indexOf(String(currentPageData[i]["id"])),1);
                        console.log(spliced);
                        if(spliced.length >= 0){
                            console.log(numberOfSelectedUser);
                            numberOfSelectedUser -= 1;
                        }
                    }
                    sessionStorage.setItem("selected user", selected);
                }
                let checkBox = document.getElementsByClassName("check-box");
                for(let i = 0;i < checkBox.length;i++){
                    console.log(checkBox[i].checked);
                    checkBox[i].checked = false;
                }
                console.log( "True : " + numberOfSelectedUser);
                toggleMainBtn();
            }
            else{
                let start = (currentpage - 1) * itemperPage;
                let currentPageData = scores.slice(start,start + itemperPage);
                console.log(currentPageData);
                //Select All user in curent Page
                for(let i = 0 ;i < currentPageData.length;i++){
                    if(!(currentPageData[i].id == parseInt(sessionStorage.getItem("id")))){
                        console.log( "Session data : " + sessionStorage.getItem("selected user"));
                        if(!sessionStorage.getItem("selected user")){
                            numberOfSelectedUser += 1;
                            sessionStorage.setItem("selected user", currentPageData[i].id);
                        }
                        else{
                            let selected = sessionStorage.getItem("selected user").split(",");
                            //Check if the user is already selected
                            if(!selected.includes(String(currentPageData[i]["id"]))){  
                                numberOfSelectedUser += 1;
                                sessionStorage.setItem("selected user", sessionStorage.getItem("selected user") + "," + currentPageData[i].id);
                            }
                        }
                    }
                }
                let checkBox = document.getElementsByClassName("check-box");
                for(let i = 0;i < checkBox.length;i++){
                    checkBox[i].checked = true;
                }
                toggleMainBtn();
            }
        });
    }
    else{
        $("#title").text("Leader Board Of room : " + sessionStorage.getItem("currentroomname"));
        $("#searchBar").hide();
        $("#selectallrow").hide();
        $("#selectAll").hide();
    }

        $("#mainbox").mouseover(function(){
            $('[data-toggle="tooltip"]').tooltip({
                trigger : 'hover'
            });
        });

        if(sessionStorage.getItem("mode")){
            if(sessionStorage.getItem("mode") == 0){
                document.getElementById("bdy").id = "bdy-dark";
                document.getElementById("mainbox").id = "mainbox-dark";
                document.getElementById("tfoot").id = "tfoot-dark";
                document.getElementById("listfooter").id = "listfooter-dark";
            }
        }

        $("#back").click(function(){
            sessionStorage.removeItem("from");
            window.location.replace("game.html");
        });

        $("#resetScore").click(function(){
            if(sessionStorage.getItem("selected user")){
                let selecedUser = sessionStorage.getItem("selected user").split(",");
                confirmation("Do you want to reset the score of selected users?").then(function(confirm){
                    if(confirm){
                        sessionStorage.removeItem("selected user");
                        for(let i = 0;i<selecedUser.length;i++){
                            removeUser(selecedUser[i]);
                        }
                    }
                });
            }
            else{
                popMessage("Select user to reset scores");
            }
        });

        if(!sessionStorage.getItem("selected user")){
            $("#mainbtn").hide();
        }
        else{
            $("#mainbtn").show();
        }
        
        $("#removeUsers").click(function() {
            if(sessionStorage.getItem("selected user")){
                let selecedUser = sessionStorage.getItem("selected user").split(",");

                confirmation("Do you want to delete selected users?").then(function(confirm){
                    if(confirm){
                        sessionStorage.removeItem("selected user");
                        for(let i = 0;i < selecedUser.length;i++){
                            removeUser(selecedUser[i]);
                        }
                    }
                });
            }
            else{
                popMessage("Select user to delete user");
            }
        });

        function reverseNameSort(){
            currentpage = 1;
            document.getElementById("namesortsymbol").classList.remove("fa-sort-alpha-asc");
            document.getElementById("namesortsymbol").classList.add("fa-sort-alpha-desc");
            document.getElementById("ranksortsymol").classList.remove("fa-sort" ,"fa-sort-numeric-desc","fa-sort-numeric-asc");
            document.getElementById("ranksortsymol").classList.add("fa-sort");
            document.getElementById("pointsortsymbol").classList.remove("fa-sort" ,"fa-sort-numeric-asc","fa-sort-numeric-desc");
            document.getElementById("pointsortsymbol").classList.add("fa-sort");
            let sortedData = nameSortDecn(scores);
            addPageNumber(sortedData);
            $("#sortByName").off('click').on('click',sortName);
        }

        function sortName() {
            currentpage = 1;
            document.getElementById("namesortsymbol").classList.remove("fa-sort-alpha-desc");
            document.getElementById("namesortsymbol").classList.add("fa-sort-alpha-asc");
            document.getElementById("ranksortsymol").classList.remove("fa-sort" ,"fa-sort-numeric-desc","fa-sort-numeric-asc");
            document.getElementById("ranksortsymol").classList.add("fa-sort");
            document.getElementById("pointsortsymbol").classList.remove("fa-sort" ,"fa-sort-numeric-asc","fa-sort-numeric-desc");
            document.getElementById("pointsortsymbol").classList.add("fa-sort");
            let sortedData = nameSortAcen(scores);
            addPageNumber(sortedData);
            $("#sortByName").off('click').on('click',reverseNameSort);
        }

        function sortRankReverse(){
            currentpage = 1;
            let sortedData = sortRankAcen(scores);
            document.getElementById("namesortsymbol").classList.remove("fa-fw" ,"fa-sort-alpha-asc","fa-sort-alpha-desc");
            document.getElementById("namesortsymbol").classList.add("fa-sort");
            document.getElementById("ranksortsymol").classList.remove("fa-sort" ,"fa-sort-numeric-desc");
            document.getElementById("ranksortsymol").classList.add("fa-sort-numeric-asc");
            document.getElementById("pointsortsymbol").classList.remove("fa-sort" ,"fa-sort-numeric-asc");
            document.getElementById("pointsortsymbol").classList.add("fa-sort-numeric-desc");
            addPageNumber(sortedData);
            $("#sortByRank").off('click').on('click',sortRank);
            $("#sortByPoint").off('click').on('click',sortRank);
        }

        function sortRank() {
            currentpage = 1;
            let sortedData = sortRankDecn(scores);
            document.getElementById("namesortsymbol").classList.remove("fa-sort","fa-fw","fa-sort-alpha-asc","fa-sort-alpha-desc");
            document.getElementById("namesortsymbol").classList.add("fa-sort");
            document.getElementById("ranksortsymol").classList.remove("fa-sort","fa-sort-numeric-asc");
            document.getElementById("ranksortsymol").classList.add("fa-sort-numeric-desc");
            document.getElementById("pointsortsymbol").classList.remove("fa-sort" ,"fa-sort-numeric-desc");
            document.getElementById("pointsortsymbol").classList.add("fa-sort-numeric-asc");
            addPageNumber(sortedData);
            $("#sortByRank").off('click').on('click',sortRankReverse);
            $("#sortByPoint").off('click').on('click',sortRankReverse); 
        }

        $("#sortByName").off('click').on('click',sortName);

        $("#sortByRank").off('click').on('click',sortRank);

        $("#sortByPoint").off('click').on('click',sortRank);
        
        $("#makeAdmin").click(function(){
            if(sessionStorage.getItem("selected user")){
                let selecedUser = sessionStorage.getItem("selected user").split(",");
                confirmation("Are you sure you want to make selected user admin?").then(function(confirm){
                    if(confirm){
                        sessionStorage.removeItem("selected user");
                        for(let i = 0;i < selecedUser.length;i++){
                            makeAdmin(selecedUser[i]);
                        }
                    }
                });
            }
            else{
                popMessage("Select user to make Admin");
            }
        });
    }
});

function nameSortAcen(data) {
    let sortedData = data.sort((data1,data2)=>{
        if(data1.username < data2.username){
            return -1;
        }
        if(data1.username > data2.username){
            return 1;
        }
        return 0;
    });
    return sortedData;
}

function nameSortDecn(data) {
    let sortedData = data.sort((data1,data2)=>{
        if(data1.username < data2.username){
            return 1;
        }
        if(data1.username > data2.username){
            return -1;
        }
        return 0;
    });
    return sortedData;
}

function sortRankDecn(data){
    let sortedData = data.sort((data1,data2)=>{
        if(data1.rank < data2.rank){
            return 1;
        }
        if(data1.rank > data2.rank){
            return -1;
        }
        return 0;
    });
    return sortedData;
}

function sortRankAcen(data){
    let sortedData = data.sort((data1,data2)=>{
        if(data1.rank < data2.rank){
            return -1;
        }
        if(data1.rank > data2.rank){
            return 1;
        }
        return 0;
    });
    return sortedData;
}

function addPageNumber(scores){
    numberOfPages = Math.ceil(scores.length / itemperPage);
    console.log("Number Of Pages : " + numberOfPages);
    let pagedata = scores.slice(0,itemperPage);
    loadPageContent(pagedata);
    $("#prev").unbind().click(function(){
        console.log(currentpage + " == > no of page : " + numberOfPages);
        if(currentpage > 1){
            console.log("dcas !@#");
            currentpage = currentpage - 1;
            console.log( "PREV :" + currentpage);
            let start = (currentpage - 1) * itemperPage;
            pagedata = scores.slice(start,start + itemperPage);
            Pages(scores);
            loadPageContent(pagedata);
        }
    });
   
    Pages(scores);

    $("#first").click(function(){
        console.log(currentpage + " == > no of page : " + numberOfPages);
        currentpage = 1;
        let start = (currentpage - 1) * itemperPage;
        pagedata = scores.slice(start,start + itemperPage);
        Pages(scores);
        loadPageContent(pagedata);
    });

    $("#next").unbind().click(function(){
        console.log(currentpage + " == > no of page : " + numberOfPages);
        if(currentpage < numberOfPages){
            console.log("dcas !@#");
            currentpage = currentpage  + 1;
            console.log( "PREV :" + currentpage);
            let start = (currentpage - 1) * itemperPage;
            pagedata = scores.slice(start,start + itemperPage);
            Pages(scores);
            loadPageContent(pagedata);
        }
    })

    $("#last").click(function(){
        console.log(currentpage + " == > no of page : " + numberOfPages);
        currentpage = numberOfPages;
        let start = (currentpage - 1) * itemperPage;
        pagedata = scores.slice(start,start + itemperPage);
        Pages(scores);
        loadPageContent(pagedata);
    });
}

// Add Page Numbers
function Pages(scores){
    $("#pages").empty();
    let perPage = 2;
    let start;
    let pagerangeright;

    if(currentpage == 1){
        $("#first").hide();
        $("#prev").hide();
    }
    else{
        $("#first").show();
        $("#prev").show();
    }

    if(currentpage == numberOfPages){
        $("#last").hide();
        $("#next").hide();
    }
    else{
        $("#last").show();
        $("#next").show();
    }
    if(currentpage < perPage){
        start = 1;
    }
    else{
        start = currentpage - 1;
    }

    if(numberOfPages - (currentpage + perPage) < 0){
        pagerangeright = numberOfPages;
    }
    else{
        pagerangeright = start + perPage;
    }

    for(let i = start; i <= pagerangeright ;i++){
        $("<button/>",{
            text: i,
            id : i,
            click : function() {
                let start = (i - 1)*itemperPage;
                let pagedata = scores.slice(start,start + itemperPage);
                console.log(pagedata);
                currentpage = i;
                Pages(scores);
                loadPageContent(pagedata);
            }
        }).appendTo("#pages");
    }
    disableCurrentPage();
}

// Load User Data 
function loadPageContent(data){
    numberOfSelectedUser = 0;
    $('[data-toggle="tooltip"]').tooltip();
    document.getElementById("scoreboard").innerHTML = " ";
    for(let i = 0;i < data.length;i++){
        $("<tr><th id="+ data[i]["id"] + "check></th><th>" + data[i]["rank"] + "</th><th>" + data[i]["username"] 
        +((data[i]["adminstatus"])?(" <span class='badge bg-success'><small>" 
        + "<i class = 'fa fa-user-secret'></i></small></span>"):(""))
        + "</th><th>" + data[i]["score"] +"</th><th id= "
        + data[i]["id"] +"admin>"
        +"</th><th id= " + data[i]["id"] +"remove></th><th id="
        +data[i]["id"] +"reset></th><th id= " + data[i]["id"] + "password></th></tr>").appendTo("#scoreboard");
        if(!sessionStorage.getItem("currentroomid")){
        let selected = new Array();
        if(numberOfSelectedUser == document.getElementsByClassName("check-box").length){
            if(numberOfSelectedUser != 0){
                toggleSelectAll(true);
            }
        }
        else{
            toggleSelectAll(false);
        }
        //Check if selected user Exist
        if(sessionStorage.getItem( "selected user")){
            selected = sessionStorage.getItem("selected user").split(",");
        }
        else{
            $("#mainbtn").hide();
        }
        if(selected.includes(String(data[i]["id"]))){   //Check if this user is already checked
            $("<input />",{
                type : 'checkbox',
                class:"check-box",
                checked : true, 
                click : function(){
                    if(!this.checked){
                        selected = sessionStorage.getItem( "selected user").split(",");
                        selected.splice(selected.indexOf(String(data[i]["id"])),1);
                        sessionStorage.setItem("selected user", selected);
                        numberOfSelectedUser -= 1;
                    }
                    else{
                        if(!sessionStorage.getItem("selected user")){
                            sessionStorage.setItem("selected user", data[i]["id"]);
                        }
                        else{
                            sessionStorage.setItem("selected user", sessionStorage.getItem("selected user") +  "," + data[i]["id"]);
                        }
                        numberOfSelectedUser += 1;
                        selected = sessionStorage.getItem("selected user").split(",");
                    }
                    if(numberOfSelectedUser == document.getElementsByClassName("check-box").length){
                        if(numberOfSelectedUser != 0){
                            console.log("1 : " + numberOfSelectedUser);
                            toggleSelectAll(true);
                        }
                    }
                    else{
                        toggleSelectAll(false);
                    }
                    toggleMainBtn();

                }
            }).appendTo("#" + data[i]["id"] + "check");    
        }
        else{
            if(data[i]["id"] == parseInt(sessionStorage.getItem("id"))){ 

            }
            else{
                $("<input />",{
                type : 'checkbox',
                class:"check-box",
                checked : false, 
                click : function(){
                    let selected;
                    if(sessionStorage.getItem("selected user")){
                        selected = sessionStorage.getItem( "selected user").split(",");
                    }
                    console.log(this.checked);
                    if(this.checked){
                        console.log(data[i]["id"]);
                        if(!sessionStorage.getItem("selected user")){
                            $("#mainbtn").show();
                            sessionStorage.setItem( "selected user", data[i]["id"]);
                        }
                        else{
                            sessionStorage.setItem( "selected user", sessionStorage.getItem("selected user") +  "," + data[i]["id"]);
                        }
                        numberOfSelectedUser += 1;
                        selected = sessionStorage.getItem( "selected user").split(",");
                    }
                    else{
                        selected.splice(selected.indexOf(String(data[i]["id"])),1);
                        sessionStorage.setItem( "selected user", selected);
                        selected = sessionStorage.getItem( "selected user").split(",");
                        numberOfSelectedUser -= 1;
                    }
                    console.log(numberOfSelectedUser + " === " + document.getElementsByClassName("check-box").length);
                    if(numberOfSelectedUser == document.getElementsByClassName("check-box").length){
                        if(numberOfSelectedUser != 0){
                            console.log("2 : " + numberOfSelectedUser);
                            toggleSelectAll(true);
                        }
                    }
                    else{
                        toggleSelectAll(false);
                    }
                    toggleMainBtn();

                }
            }).appendTo("#" + data[i]["id"] + "check");
        }
    }
    if(data[i]["id"] != sessionStorage.getItem("id")){
        $("<button/>",
        {
            id :  data[i]["id"] + "removeid",
            class : "btn btn-outline-danger",
            "data-toggle" : "tooltip",
            "data-placement" : "right", 
            title : "Delete this user",
            click : function(){
                confirmation("Do you want to delete this user?").then(function(confirm){
                    if(confirm){
                        removeUser(data[i]["id"]);
                    }
                    else{
                        console.log("Delete reject");
                    }
                });
                return;
            }
        }).appendTo( "#" + data[i]["id"] + "remove");
        
        $("<i/>",{
            class : "fa fa-trash",                      
        }).appendTo("#" + data[i]["id"] + "removeid");

        if(data[i]["score"] > 0){
            $("<button/>",
            {
                id :  data[i]["id"] + "resetid",
                class:"btn btn-outline-secondary",
                "data-toggle" : "tooltip",
                "data-placement" : "right", 
                title : "Reset Score",
                click : function(){
                    console.log("Clicked Rest scr");
                    confirmation("Do you want to reset the score of this user?").then(function(confirm){
                        if(confirm){
                            console.log("Reset C");
                            resetScore(data[i]["id"]);
                        }
                        else{
                            console.log("Reset RJ");
                        }
                    });
                }
            }).appendTo( "#" + data[i]["id"] + "reset");

            $("<i/>",{
                class:"fa fa-refresh",
            }).appendTo("#"+ data[i]["id"] + "resetid");
        }

        $("<button/>",
        {
            id :  data[i]["id"] + "changeid",
            class:"btn btn-outline-info",
            "data-toggle" : "tooltip",
            "data-placement" : "top", 
            title : "Change Password",
            click : function(){
                console.log("Clicked Pass Cng");
                confirmation("Are you sure you want to Change Password of this user ?").then(function(confirm){
                    console.log(confirm);
                    if(confirm){
                        getPassword(function(password){
                            console.log("Change Password");
                            if(!password){
                            console.log("Pass Sbm N");
                                popMessage("Enter Password Before submit");
                            }
                            else if(password.length >= 8){
                                if(ChangePassword(data[i]["id"],password)){
                                    popMessage("Password Changed",function(){
                                        location.reload();                                        
                                    });
                                }
                            }
                            else{
                                popMessage("Invalid Password!Should Contain Atleast 8 characters");
                            }
                        });
                    }
                });
                }
        }).appendTo("#" + data[i]["id"] + "password");
        $("<i/>",{
            class : "fa fa-edit"
        }).appendTo("#" + data[i]["id"] + "changeid");
    }
        if(!data[i]["adminstatus"]){
            $("<button/>",
            {
                class:"btn btn-outline-success",
                id :  data[i]["id"],
                "data-toggle" : "tooltip",
                "data-placement" : "right", 
                title : "Make this User Admin",
                click :async function(){
                    console.log("Clicked Make Admin");
                    confirmation("Are you sure you want to make this user admin ?").then(function(confirm){
                        console.log(confirm);
                        if(confirm){
                            makeAdmin(data[i]["id"]);
                        }
                    });
                }
            }).appendTo( "#" + data[i]["id"] + "admin");
            $("<i/>",{
                class:"fa fa-user-secret",
            }).appendTo("#" + data[i]["id"]);
        }
        else{
            if((data[i]["id"] != sessionStorage.getItem("id"))){
                $("<button/>",
                {
                    id : data[i]["id"],
                    class:"btn btn-outline-primary",
                    "data-toggle" : "tooltip",
                    "data-placement" : "right", 
                    title : "Revoke Admin",
                    click : function(){
                        confirmation("Are you sure you want to revoke this Admin?").then(function(confirm){
                            console.log(confirm);
                            if(confirm){
                                revokeAdmin(data[i]["id"]);
                            }
                        });
                    }
                }).appendTo( "#" + data[i]["id"] + "admin");
                $("<i/>",{
                    class:"fa fa-user",
                }).appendTo("#" + data[i]["id"]);
            }
            else{
                $("<p>").appendTo( "#" + data[i]["id"] + "admin")
            }
        }
    }
    let checkBox = document.getElementsByClassName("check-box");
    for(let i = 0;i < checkBox.length;i++){
        if(checkBox[i].checked){
            numberOfSelectedUser += 1;
        }
    }
    if(numberOfSelectedUser == checkBox.length){
        if(numberOfSelectedUser != 0){
            toggleSelectAll(true);
        }
    }
    else{
        toggleSelectAll(false);
    }
}
$("#currentpage").text(currentpage);    //Update Current Page status 

}

function toggleSelectAll(value){
    document.getElementById("selectAll").checked = value;
}

function toggleMainBtn(){
    if(sessionStorage.getItem("selected user")){
        $("#space").hide();
        $("#mainbtn").show();
    }
    else{
        $("#mainbtn").hide();
        $("#space").show();
    }
}

function disableCurrentPage(){
    $("#" + currentpage).attr('disabled', 'true');   
    $("#" + currentpage).css("border-color",'rgb(179, 236, 252)');
}

function loadDefaultPage(){
    loadScoreBoard().then(function(data){
        scores = JSON.parse(data);
        addPageNumber(scores);
    });
}

function loadRoomScorePage(){
    loadRoomScoreBoard(sessionStorage.getItem("currentroomid")).then(function(data){
        scores = JSON.parse(data);
        addPageNumber(scores);
    });
}