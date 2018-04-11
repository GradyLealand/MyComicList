"use strict";

$(document).ready(function()
{
    //establish the issues table using json-server data source
    $('#issuesTable').DataTable(
        {
            ajax: {
                url: '',
                type: 'GET',
                dataSrc: '',
                dataType: 'json'
            },
            "initComplete": function()
            {
                // //enable the submit button on a successful load of the datatable
            },

            "columns" : [
                {"data": "id", "visible": false},
                {"data": "title", "width": "20%", "class": "titleClick"},
                {"data": "year", "width": "50%"},
                {"data": "publisher", "width": "20%"},
                {"defaultContent" : "<button class='addBtn'>Add</button>", "width": "5%"}
            ]
        });
});
