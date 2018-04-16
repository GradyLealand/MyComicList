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

    console.log(ajaxResults);

    //fill columns with results
    $('#issuesTable').DataTable(
        {
            "data": ajaxResults,
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

    //make the details div visible
    $("#mainDetailDiv").show();
}

$("#modalRegisterBtn").click(function () {
    //validate fields
    var valid = validateReg();

    if(valid === true)
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
    $("#registerUserName").val("");
    $("#registerPassword").val("");
    $("#registerConfirmPassword").val("");

});

function navLoggedIn()
{
    $("#userNameDisplay").text($.session.get("userName")).show();
    $("#listRedirect").show();
    $("#loginBtn").hide();
    $("#logoutBtn").show();
    $("#signUpBtn").hide();
}

function navLoggedOut()
{
    $("#userNameDisplay").text($.session.get("userName")).hide();
    $("#listRedirect").hide();
    $("#loginBtn").show();
    $("#logoutBtn").hide();
    $("#signUpBtn").show();
}

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


