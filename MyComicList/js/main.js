"use strict";

var serverRoute = "http://localhost:8080/";

$(document).ready(function()
{
    //-----REDIRECTS-----//
    $('.homeRedirect').click(function()
    {
        window.location="index.html";
    });

    $('#listRedirect').click(function()
    {
        window.location="my_list.html";
    });

    //-----INITIAL AJAX SEARCH CALL-----//
    $('#searchSubmit').click(function()
    {
        //get the values of the
        var searchedValue = $('#searchBox').val();

        if (searchedValue != null)
        {
            $.ajax({
                type: 'GET',
                url: "https://comicvine.gamespot.com/api/search/?api_key=3c9b6835ca751c6ecab4484f83014979472a4565&query=" + searchedValue + "&resources=volume&format=jsonp&json_callback=handleCallback",
                dataType: 'jsonp',
                contentType: 'application/json',
                success: function (data)
                {
                    handleCallback(data);
                }
            });
        }
        //make the details div hidden
        $("#mainDetailDiv").hide();
    });
});

//-----DATATABLE INITIALIZATION-----//
function handleCallback(data)
{
    //destroy old table if it exists
    $('#issuesTable').dataTable().fnDestroy();

    var ajaxResults = data.results;

    if (ajaxResults != null)
    {
        $('#issuesTable').show();
    }

    //fill columns with results
    $('#issuesTable').DataTable(
        {
            "data": ajaxResults,
            retrieve: true,
            "columns": [
                {"data": "id", "visible": false},
                {"data": "name", "width": "30%", "class": "titleClick"},
                {"data": "start_year", "width": "20%"},
                {"data": "count_of_issues", "width" : "20%"},
                {"data": "publisher.name", "width": "20%"},
                {"defaultContent": "<button class='addBtn' style='width: 100%'>Add</button>", "width": "10%"}
            ]
        });
}

//-----HANDLE TITLE CLICK-----//
$('#issuesTable').on('click', '.titleClick', function()
{
    //hide the jumbrotron
    $('.jumbotron').hide();

    //display loader
    $('#batmanDiv').show();

    //navigate to this the row where this was clicked
    var table = $('#issuesTable').DataTable();
    var data = table.row($(this).parents('tr')).data();

    //find the ID
    var id = data.id;

    console.log(id);

    $.ajax({
        type: 'GET',
        url: "https://comicvine.gamespot.com/api/volume/4050-" + id + "/?api_key=3c9b6835ca751c6ecab4484f83014979472a4565&format=jsonp&json_callback=handleTitleClick",
        dataType: 'jsonp',
        contentType: 'application/json',
        success: function (data)
        {
           handleTitleClick(data);
        }
    });
});

function handleTitleClick(data)
{
    var details = data.results;
    console.log(details);
    $("#mainDetailImg").attr("src", details.image.medium_url);
    $("#mainDetailTitle").html(details.name);
    $("#mainDetailYear").html(details.start_year);
    $("#mainDetailIssues").html(details.issues.length);
    $("#mainDetailDescription").html(details.description);

    //hide loader
    $('#batmanDiv').hide();

    //make the details div visible
    $("#mainDetailDiv").show();
}

//-----FUNCTIONS RELATED TO COMICS-----//

//add a new volume
$('#issuesTable').on( 'click', '.addBtn', function() {

    //navigate to this the row where this was clicked
    var table = $('#issuesTable').DataTable();
    var data = table.row($(this).parents('tr')).data();

    //find the ID
    var volume_comicVineId = data.id;
    var volume_name = data.name;
    var user_id = $.session.get("userId");

    var new_volume = {"volume_comicVineId" : volume_comicVineId, "volume_name" : volume_name, "user_id" : user_id};

    //POST to see if volume is already in DB
    $.ajax({
        url: serverRoute + "volumeExists",
        type: "POST",
        contentType: "application/json",
        processData: false,
        data: JSON.stringify(new_volume),

        success: function ()
        {
            alert("Successfully added this volume to your list!");
        }
    });
});

$("#modalRegisterBtn").click(function () {
    //validate fields
    var valid = validateReg();

    validateName();
});

//confirm login credentials
function verifyUser()
{
    var user_name = $('#loginUserName').val();
    var user_password = $('#loginPassword').val();

    var login_user = {"user_name" : user_name, "user_password" : user_password};

    //check for valid user
    $.ajax({
        url: serverRoute + "login",
        type: "post",
        contentType: "application/json",
        processData: false,
        data: JSON.stringify(login_user),

        success: function (data)
        {
            console.log(data.user_id);
            if(data !== "0")
            {
                //if proper login set session user
                $.session.set("userName", $("#loginUserName").val());
                $.session.set("userId", data);
                console.log($.session.get("userId"));
                //set user related nav bar section
                navLoggedIn();
            }
            else
            {
                alert("Invalid user name or password!")
            }
        }
    });
}

//set navbar to logged in mode
function navLoggedIn()
{
    $("#userNameDisplay").text($.session.get("userName")).show();
    $("#listRedirect").show();
    $("#loginBtn").hide();
    $("#logoutBtn").show();
    $("#signUpBtn").hide();
}

//set nav bar to logged out mode
function navLoggedOut()
{
    $("#userNameDisplay").text($.session.get("userName")).hide();
    $("#listRedirect").hide();
    $("#loginBtn").show();
    $("#logoutBtn").hide();
    $("#signUpBtn").show();
}

//validate log in feilds
function validateReg()
{
    //username must be at least 3 characters
    if($("#registerUserName").val().length < 3)
    {
        alert("username too short");
        return false;
    }

    //password must be at least 5 characters
    if($("#registerPassword").val().length < 5)
    {
        alert("Password too short too short");
        return false;
    }
    if($("#registerPassword").val() !== $("#registerConfirmPassword").val())
    {
        alert("Passwords do not match");
        return false
    }

    return true;
}

//check to see if the user name already exists
function validateName()
{
    var user_name = $('#registerUserName').val();

    var new_user = {"user_name" : user_name};

    console.log(new_user);

    //POST a new user
    $.ajax({
        url: serverRoute + "userExists",
        type: "post",
        contentType: "application/json",
        processData: false,
        data: JSON.stringify(new_user),

        success: function (data)
        {
            console.log("set: " + data);
            checkName(data);
        }

    });

    function checkName(data)
    {
        if(!data)
        {
            alert("User name taken!");
        }
        else
        {
            console.log("Attempting to add user");

            var user_name = $('#registerUserName').val();
            var user_password = $('#registerPassword').val();
            var user_email = $('#registerUserEmail').val();

            var new_user = {"user_name" : user_name, "user_password" : user_password, "user_email" : user_email};

            console.log(new_user);

            //POST a new user
            $.ajax({
                url: serverRoute + "addUser",
                type: "post",
                contentType: "application/json",
                processData: false,
                data: JSON.stringify(new_user),

                success: function (data)
                {
                    console.log(data);
                }

            });

            //if registration valid
            $.session.set("userName", $("#registerUserName").val());
            $('#myModal').modal('hide');
            //set user related nav bar section
            navLoggedIn();
        }

        //reset fields
        $("#registerUserName").val("");
        $("#registerPassword").val("");
        $("#registerConfirmPassword").val("");
        $("#registerUserEmail").val("");
    }
}

//get all volumes in a users library
function loadUserLibrary() {
    var user_id = {"user_id" : $.session.get("userId")};

    $('#batmanLibDiv').show();

    setTimeout(function() {
    //Get user library
    $.ajax({
        url: serverRoute + "library",
        type: "post",
        contentType: "application/json",
        processData: true,
        data: JSON.stringify(user_id),

        success: function (data)
        {
            $('#myListTable').DataTable(
                {
                    "data": data,
                    retrieve: true,
                    "columns": [
                        {"data": "entry_user_id", "visible": false},
                        {"data": "entry_volume_id", "visible": false},
                        {"data": "volume_comicVineId", "width": "10%"},
                        {"data": "volume_name", "width": "40%"},
                        {"data": function(data) {
                                if (data.entry_status === 0)
                                {
                                    return "<input class='checkBoxRead' type='checkbox'>";
                                }
                                else
                                {
                                    return "<input class='checkBoxRead' type='checkbox' checked='checked'>";
                                }
                            }, "width": "40%"},
                        {"defaultContent": "<button class='delBtn' style='width: 100%'>Remove</button>", "width": "10%"}
                    ]
                });
        }

    }); $('#batmanLibDiv').hide();}, 1500);
}

//onClick for delete from list
$('#myListTable').on( 'click', '.delBtn', function() {

    //navigate to this the row where this was clicked
    var table = $('#myListTable').DataTable();
    var data = table.row($(this).parents('tr')).data();

    //find the ID
    var entry_user_id = data.entry_user_id;
    var entry_volume_id = data.entry_volume_id;

    var del_entry = {"entry_user_id" : entry_user_id, "entry_volume_id" : entry_volume_id};

    //POST to remove volume from entry
    $.ajax({
        url: serverRoute + "delete",
        type: "POST",
        contentType: "application/json",
        processData: false,
        data: JSON.stringify(del_entry),

        success: function ()
        {
            alert("Successfully removed from your list!");
            reloadTable();
        }
    });
});

//onClick for checkboxes
$('#myListTable').on('click', '.checkBoxRead', function() {

    //navigate to this the row where this was clicked
    var table = $('#myListTable').DataTable();
    var data = table.row($(this).parents('tr')).data();

    //find the ID
    var entry_user_id = data.entry_user_id;
    var entry_volume_id = data.entry_volume_id;
    var entry_status;

    if (this.checked)
    {
        entry_status = 1;

    }
    else if (!this.checked)
    {
        entry_status = 0;
    }

    var update_entry = {"entry_user_id" : entry_user_id, "entry_volume_id" : entry_volume_id, "entry_status" : entry_status };

    //POST to update a read status
    $.ajax({
        url: serverRoute + "updateStatus",
        type: "POST",
        contentType: "application/json",
        processData: false,
        data: JSON.stringify(update_entry),

        success: function () {
            alert("Successfully changed status of entry!");
            reloadTable();
        }
    });

});

//reload a datatable
function reloadTable()
{
    var table = $('#myListTable').DataTable();
    table.destroy();
    loadUserLibrary();
}
