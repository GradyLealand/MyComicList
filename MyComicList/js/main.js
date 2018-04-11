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

function handleCallback(data)
{
    console.log(data);
}
