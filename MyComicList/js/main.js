"use strict";

$(document).ready(function()
{
    //-----DATATABLE INITIALIZATION-----//

    //TODO commented out because they were giving errors in their current state - no data being retrieved yet

    //establish the issues table (index.html)
    // $('#issuesTable').DataTable(
    //     {
    //         ajax: {
    //             url: '',
    //             type: 'GET',
    //             dataSrc: '',
    //             dataType: 'json'
    //         },
    //         "initComplete": function()
    //         {
    //             // //enable the submit button on a successful load of the datatable
    //         },
    //
    //         "columns" : [
    //             {"data": "id", "visible": false},
    //             {"data": "title", "width": "20%"},
    //             {"data": "year", "width": "50%"},
    //             {"data": "publisher", "width": "20%"},
    //             {"defaultContent" : "<button class='addBtn'>Add</button>", "width": "5%"}
    //         ]
    //     });
    //
    // //establish the personalized list table (my_list.html)
    // $('#myListTable').DataTable(
    //     {
    //         ajax: {
    //             url: '',
    //             type: 'GET',
    //             dataSrc: '',
    //             dataType: 'json'
    //         },
    //         "initComplete": function()
    //         {
    //             // //enable the submit button on a successful load of the datatable
    //         },
    //
    //         "columns" : [
    //             {"data": "id", "visible": false},
    //             {"data": "title", "width": "20%"},
    //             {"defaultContent" : "<input class='checkRead' type='checkbox'>", "width": "10%"},
    //             {"defaultContent" : "<input class='checkFav' type='checkbox'>", "width": "10%"},
    //             {"defaultContent" : "<button class='removeBtn'>Remove</button>", "width": "10%"}
    //         ]
    //     });

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
        var searchedValue = $('#searchBox').val();
        $.ajax({
            type: 'GET',
            url: 'http://comicvine.gamespot.com/api/character/4005-75487/?api_key=3c9b6835ca751c6ecab4484f83014979472a4565&format=jsonp&json_callback=handleCallback',
            dataType: 'jsonp',
            contentType: 'application/json',


            success: function (data)
            {
                handleCallback(data);
            }
            //context: this,
            // success: function(data)
            // {
            //     //$('#content').html(data.objects[0].category+'<br>'+data.objects[0].company);
            //     console.log(data)
            // },
            // error: function ()
            // {
            //     console.log("not working?");
            //     alert('Request error');
            // }

        });
    });
});

$("#modalRegisterBtn").click(function () {
    //validate fields
    var valid = validateReg();

    if(valid === true)
    {
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

function handleCallback(data)
{
    console.log(data);
}

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


