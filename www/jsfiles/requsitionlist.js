
var req_id = localStorage.creatorid;//localStorage.requesterid;
var resdata;

var time = new Date().getTime();
var inFilters = false;   // Flag to indicate present view (Reqlist or Filters)

$(document).ready(function()
{
    /* Auto reload logic*/
    $(document.body).bind("mousemove keypress", function(e) {   // Capturing current time to calculate refresh page
        time = new Date().getTime();
    });

    function refresh() {    // Auto refresh
        if((new Date().getTime() - time >= 30000)&& !inFilters) 
            window.location.reload(true);
        else 
            setTimeout(refresh, 30000);
    }
    setTimeout(refresh, 30000);
    /* Auto reload logic END*/
    
    
    hide();
    $("#loading_screen").show();
    $("#user_name").text( localStorage.requestorname);
    var params = '{"requester_id":"' + req_id + '"}';
    if(localStorage.filters != undefined && localStorage.filters.length>0){
        params = localStorage.filters;
    //        setReqFilters();
    }
    var url = baseURL + 'GetRequisitionList';
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'jsonp',
        data: 'body=' + params,
        timeout: 30000,
        async: false,
        success: function(data, textStatus, xhr) 
        {
            data.replace(/\'/g, '\'');
            var response = JSON.parse(data);
            hide();
            $("#requisitions_div").show();

            if (response.response == 'success')
            {
                resdata = response.data;
                requisitionList();
            }else{
                $("#error_msg").text(response.data.status);
                $("#canceldialog").popup('open');
                $('#alert_ok').click(function()
                {
                    $("#canceldialog").popup('close');
                });
            }
        },
        error: function(request, status, error) {
            hide();
            alert(error);
            $("#requisitions_div").show();
            $("#error_msg").text(error);
            $("#canceldialog").popup('open');
        }
    });
    $('#search_list').click(function()//when click on search button this API will be called
    {
        hide();
        $("#loading_screen").show();
        var list = $("#list_text").val();
        var url = baseURL + 'GetRequisitionList';
        var params = '{"requester_id":"' + req_id + '",\"search_string\":\"' + encodeURIComponent(list)+ '\"}';
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'jsonp',
            data: 'body=' + params,
            timeout: 30000,
            async: false,
            success: function(data, textStatus, xhr) {
                var response = JSON.parse(data);
                hide();
                $("#requisitions_div").show();
                if (response.response == 'success')
                {
                    resdata = response.data;
                    requisitionList();
                }
            },
            error: function(request, status, error) {
                hide();
                $("#error_msg").text(error);
                $("#canceldialog").popup('open');
                $("#requisitions_div").show();
            }
        });
    });
    $('#filter_save').click(function()//called when click on done button in filters
    {
        inFilters = false;
        var requestor_search;
        var creator_search;
        var checkbox_status=[];
        if($("#checkbox_requestor").prop('checked') == true)
        {
            requestor_search=req_id;
        }
        else
        {
            requestor_search="";
        }
        if($("#checkbox_creator").prop('checked') == true)
        {
            creator_search=req_id;
        }
        else
        {
            creator_search="";
        }
        if(requestor_search.length==0 && creator_search.length==0){
            requestor_search=req_id;
            creator_search=req_id;
        }
        $("input[name='checkbox_status']:checked").each(function ()
        {
            checkbox_status[checkbox_status.length]='"'+$(this).val()+'"';
        });
        var url = baseURL + 'GetRequisitionList';
        var list = $("#list_text").val();
        if(requestor_search.length || creator_search.length){
            hide();
            $("#loading_screen").show();
            //    var params = '{"requester_id":"' + req_id + '",\"search_string\":\"' + list+ '\","requestor":"' + requestor_search + '","creator":"' + creator_search + '",\"status\":\[' + checkbox_status+ ']\}';
            var params = '{\"requestor\":\"' + requestor_search + '\",\"creator\":\"' + creator_search + '\",\"status\":[' + checkbox_status+ ']}';
            localStorage.filters = params;
            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'jsonp',
                data: 'body=' + params,
                timeout: 30000,
                async: false,
                success: function(data, textStatus, xhr) {
                    //  data = JSON.stringify(data);
                    var response = JSON.parse(data);
                    hide();
                    $("#requisitions_div").show();
                    if (response.response == 'success')
                    {
                        resdata = response.data;
                        requisitionList();
                    }
                },
                error: function(request, status, error) {
                    hide();
                    //                 alert(error);
                    $("#error_msg").text(error);
                    $("#canceldialog").popup('open');
                    $("#requisitions_div").show();
                }
            });
        }else{
            $("#error_msg").text('No Filter selected. Please select atleast one Filter.');
            $("#canceldialog").popup('open');
        }
    });
    $('#logout').click(function()//log out button  in requisitions
    {
        localStorage.removeItem("filters");
        document.location = "index.html";
    });
    $('#add_img').click(function() //when click on add new button
    {
        hide();
        $("#loading_screen").show();
        var flagVal = 0;
        localStorage.flag = flagVal;
        localStorage.trxid = "0";
        localStorage.requesterid = req_id;
        localStorage.warehouse = "";
        localStorage.organizationid = localStorage.orgId;
        localStorage.status = "NEW";
        localStorage.requisitionNumber = "0";
        localStorage.error_message = "";
        localStorage.itemDescription = "";
        document.location = "listitems.html";
    });
    $('#filter_img').click(function()//when click on filter button
    {
        $('#checkbox_requestor').prop('checked', false).checkboxradio('refresh');
        $('#checkbox_creator').prop('checked', false).checkboxradio('refresh');
        $("input[name='checkbox_status']").prop('checked', false).checkboxradio('refresh');
        hide();
        $("#filter_page").show();
        inFilters = true;
        if(localStorage.filters != undefined && localStorage.filters.length>0){
            setReqFilters();
        }
    });
    $('#filter_cancel').click(function()//cancel button in filter field
    {
        inFilters = false;
        hide();
        $("#requisitions_div").show();
    });

    function setReqFilters(){   // Setting previous state of filters
        var j=0;
        var filterJson = JSON.parse(localStorage.filters);
        $('#checkbox_requestor').prop('checked', (filterJson.requestor.length>0)).checkboxradio('refresh');
        $('#checkbox_creator').prop('checked', (filterJson.creator.length>0)).checkboxradio('refresh');
        var checkbox_status = filterJson.status;
        //    $("input[name='checkbox_status']").each(function (j)
        for (var i in checkbox_status) {
            $("input:checkbox[value='" + checkbox_status[i] + "']").attr('checked', true).checkboxradio("refresh");
        }
    }

});
function loadDetails(txid, reqid, orgid, warehou, requ, status1, req_num,error_msg,description)//when click on requisitions
{
    localStorage.flag = 1;
    localStorage.trxid = txid;
    localStorage.requesterid = reqid;
    localStorage.organizationid = orgid;
    localStorage.warehouse = warehou;
    localStorage.requister = requ;
    localStorage.status = status1;
    localStorage.requisitionNumber = req_num;
    localStorage.error_message = decodeURIComponent(error_msg);
    localStorage.itemDescription = decodeURIComponent(description).replace(/\"/g, '"');
    document.location = "listitems.html";
}
function hide()//for switching between pages in requisitions 
{
    $("#requisitions_div").hide();
    $("#filter_page").hide();
    $("#loading_screen").hide();
}

// Showing list of requisitions after getting data from server or when reloading page
function requisitionList()
{
    var html = '';
    for (i = 0; i < resdata.length; i++)
    {
        var req_num = '',desc = '';
        if (resdata[i].REQ_NUMBER == undefined || resdata[i].REQ_NUMBER == ""|| resdata[i].REQ_NUMBER == "0")
        {
            req_num = resdata[i].TRX_ID;
        }
        else {
            req_num = resdata[i].REQ_NUMBER;
        }
        if (resdata[i].DESCRIPTION == undefined || resdata[i].DESCRIPTION == ""|| resdata[i].DESCRIPTION == "0")
        {
            desc = '---';
        }
        else
        {
            desc =resdata[i].DESCRIPTION;
        }
        //                  
        html += '<li class="requisition_list"  onClick="loadDetails(\'' + resdata[i].TRX_ID + '\',\'' + resdata[i].REQUESTOR_ID + '\',\'' + resdata[i].ORGANIZATION_ID + '\',\'' + resdata[i].WAREHOUSE + '\',\'' + resdata[i].REQUESTOR + '\',\'' + resdata[i].STATUS + '\',\'' + req_num + '\',\'' + encodeURIComponent(resdata[i].ERROR_MESSAGE) + '\',\'' + encodeURIComponent(resdata[i].DESCRIPTION) + '\')"> ';
        html += ' <div class="list_div ">';
        html += ' <p class="reqnumber"> ' + desc+'</p>';
        html +='<p class="requisition_desc">'+req_num + '<span class="reqwarehouse_span"> (' + resdata[i].WAREHOUSE + ')</span></p>';
        
        html += '</div>';
        //        html += '<div>';
        html += ' <p class="totalamount">' + parseFloat(resdata[i].TOTAL_AMOUNT).toFixed(4) + '</p>';
        if (resdata[i].STATUS == "APPROVED")
        {
            html += ' <P class="subscript subscript_app"> ' + resdata[i].STATUS + '</P>  ';
        }
        else if (resdata[i].STATUS == "ERROR")
        {
            html += ' <P class="subscript subscript_err"> ' + resdata[i].STATUS + '</P>  ';
        }
        else
        {
            html += ' <P class="subscript"> ' + resdata[i].STATUS + '</P>  ';
        }
        //        html += '</div>';
        html += ' </li>';
    }
    if(resdata.length == 0){
        html += '<h2 style="text-align: center;">No Records Found</h2>';
    }
    $("#requisitionlist").html(html);
}
