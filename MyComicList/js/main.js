"use strict";

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
    });
});

//-----DATATABLE INITIALIZATION-----//

function handleCallback(data)
{
    //destroy old table if it exists
    $('#issuesTable').dataTable().fnDestroy();

    var ajaxResults = data.results;

    //fill columns with results
    $('#issuesTable').DataTable(
        {
            "data": ajaxResults,
            "columns": [
                // {"data": "id", "visible": false},
                {"data": "name", "width": "30%"},
                {"data": "start_year", "width": "20%"},
                {"data": "count_of_issues", "width" : "20%"},
                {"data": "publisher.name", "width": "20%"},
                {"defaultContent": "<button class='addBtn' style='width: 100%'>Add</button>", "width": "10%"}
            ]
        });
}
