var responseData = JSON.parse('{"data":[],"attachments":[]}');
var selectedItem = -2;
var itemObj = '';
var itemObj2 = '';
var req_id,creatr_id = localStorage.creatorid;

var department = localStorage.dept;
var activity = localStorage.activity;
var project = localStorage.project;
var account = localStorage.account;
var equipment = localStorage.equip;

var plus_flag = localStorage.flag;
var status_st = localStorage.status;
var sum = 0;
var totalList;
var dataExist = false;
var alert_msg="Any unsaved items will be lost. Would you like to continue?";
var comp_category;
var comp_uom;
var comp_quantity;
var comp_rate;
var comp_description;
var comp_comments;
var comp_department;
var comp_activity;
var comp_project;
var comp_equipment;
var comp_cropyear;
var accounts_flag;
var d = new Date();
var month = d.getMonth()+1;
var year=d.getFullYear();
var itemDescription=localStorage.itemDescription;


var catDept = localStorage.dept;
var catActivity = localStorage.activity;
var catAccount = localStorage.account;
var catProject = "0000";
var catEquip = "0000";
var catDeptDesc = "";
var catActivityDesc = "";
var catAccountDesc = "";
var catProjectDesc = "";
var catEquipDesc = "";

var loadData;
var editable = ((status_st == "ERROR")||(status_st == "NEW")||(status_st == "DRAFT"));




var fileURI = '';
// Wait for device API libraries to load
//
document.addEventListener("deviceready", onDeviceReady, false);

// device APIs are available
//
function onDeviceReady() {
// Retrieve image file location from specified source
    
}

function captureSuccess(mediaFiles) {
    var i, len;
    len = mediaFiles.length;
    for (i = 0; i < len; i += 1) {
    	var path = mediaFiles[i].fullPath;
        uploadPhoto(path);
    }       
}
// Called if something bad happens.
function captureError(error) {
    var msg = '';//'An error occurred during capture: ' + error.code;
    //navigator.notification.alert(msg, null, 'Photo not added');
    $("#error_msg").text('Photo not added');
    $("#canceldialog").popup('open');
    $('#alert_ok').click(function()
    {
        $("#canceldialog").popup('close');
    });
}

// A button will call this function
function getPicture(src){
//    alert(selectedItem);
	if (src){
		navigator.camera.getPicture(
			uploadPhoto,
			function(message) {
				//alert('Photo not added');
				    $("#error_msg").text('Photo not added');
    				$("#canceldialog").popup('open');
				    $('#alert_ok').click(function()
    				{
        				$("#canceldialog").popup('close');
    				});
			},
			{
				quality         : 50,
				destinationType : navigator.camera.DestinationType.FILE_URI,
				encodingType: Camera.EncodingType.JPEG,
				sourceType      : (src?navigator.camera.PictureSourceType.PHOTOLIBRARY:navigator.camera.PictureSourceType.CAMERA)
			}
			);
    }else{
    	navigator.device.capture.captureImage(captureSuccess, captureError, {
        	limit: 1
   		});
    }
}
function deteleAttachment(el,ind){
	var clickedli = $(el).parent();
	var index = clickedli.index();
	if(responseData.fileURI != undefined){
		if(responseData.attachments != undefined){
			index = index-responseData.attachments.length;
		}
		responseData.fileURI.splice(index,1);
	}
	clickedli.remove();
	$('#attachment_list').listview('refresh');
//	alert(responseData.fileURI);
}
function uploadPhoto(imageURI) {
    alert(JSON.stringify(responseData.fileURI));
	var add = true;
	var fileName = imageURI.substr(imageURI.lastIndexOf('/')+1);
//	var ext = fileName.split('.');
    var obj = {};
    obj.URI = imageURI;
    obj.lineIndex = selectedItem;
    if(responseData.fileURI == undefined){
        obj.listIndex = 0;
        var urlArr = new Array(obj);
        responseData.fileURI = urlArr;
    }else{
        var ind = 0;
        for(var ob in responseData.fileURI){    //logic for handling delete operation
            if(ob.lineIndex == selectedItem){
                ind++;
            }
        }
        obj.listIndex = ind;
        if(responseData.fileURI.indexOf(obj) < 0){
            responseData.fileURI[responseData.fileURI.length] = obj;
  //                      $("#attachment_list").append("<li style='height:30px;'><p style='display: block;float:left;margin:0;'>"+imageURI.substr(imageURI.lastIndexOf('/')+1)+"</p><p style='display: block;margin-top: 0px;float: right;color:red;margin:0;' onclick='deteleAttachment(this)'>delete</p></li>");
        }else{
        	add = false;
            //alert("File has been added already");
                $("#error_msg").text("File has been added already");
				$("#canceldialog").popup('open');
				$('#alert_ok').click(function()
				{
					$("#canceldialog").popup('close');
				});
        }
    }alert(JSON.stringify(responseData.fileURI));
    if(add && selectedItem<0){
		$("#attachment_list").append("<li>"+fileName+"<span style='display: block;margin-top: 0px;float: right;color:red;margin:0;' onclick='deteleAttachment(this,"+selectedItem+")'>delete</span></li>");
    	$('#attachment_list').listview('refresh');
	}else if(add){
        $("#line_attachment_list").append("<li>"+fileName+"<span style='display: block;margin-top: 0px;float: right;color:red;margin:0;' onclick='deteleAttachment(this,"+selectedItem+")'>delete</span></li>");
    	$('#line_attachment_list').listview('refresh');

    }
    
/*    var options = new FileUploadOptions();
    options.fileKey="file";
    options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
    options.mimeType="image/jpeg";
    
    var params = {};
    params.body = '{"response":"success","data":[{"REQUESTOR_ID":501,"ACTIVITY":"0000","CROP_TYPE":"101","PROJECT":"000027","TRX_LINE_ID":30,"ACCOUNT":"80510","CATEGORY":"RENTAL TOILETS","WAREHOUSE":"NCW","CROP_YEAR":"2013","ORGANIZATION_ID":102,"QUANTITY":2,"COMPANY":"010","FUTURE":"0000","RATE":650,"FULL_NAME":"PFC_User, PFC_New","DESCRIPTION":"Test description","COMMENTS":"comentyyu6","INTF_STATUS":"ERROR","EQUIP_CLASS":"ALL","ERROR_MESSAGE":" CHARGE OF ACCOUNT is not valid ORA-01403: no data found","AMOUNT":1300,"DEPT":"3191","TRX_ID":24,"CATEGORY_DESC":"test second item","UOM":"Monthly"}]}';
    //    params.callback = "";
    
    options.params = params;
    
    var ft = new FileTransfer();
    ft.upload(imageURI, encodeURI("http://192.168.0.101:8084/pfcmobile/FileUpload1"), win, fail, options);
    //        ft.upload(imageURI, encodeURI("http://10.130.2.23:8080/PFCMobile_server/FileUpload"), win, fail, options);
 */
}
function uploadRemaining(imageURI,trxid,lineIndex){
    //    alert(imageURI+"-------====----"+trxid);
    //    for(var i=0;i<imageArr.length;i++){
    //        var imageURI = imageArr[i];
    localStorage.lineIndex = lineIndex;
    fileURI = imageURI;
    $("#loading_screen").show();
    var options = new FileUploadOptions();
    options.fileKey="file";
    options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
    options.mimeType="image/jpeg";
        
    var params = {};
    params.body = '{"data":[]}';
    params.trxid = trxid;
    params.lineIndex = lineIndex;
    var response = JSON.parse(localStorage.trxidList);
    localStorage.trxid = response.TRX_ID;
    if(response.data.length){alert(response.data[lineIndex].TRX_LINE_ID);
        params.trxlineid = response.data[lineIndex].TRX_LINE_ID;
    }
    options.params = params;
    var ft = new FileTransfer();
    var url = baseURL + 'FileUpload1';
    ft.upload(imageURI, encodeURI(url), win, fail, options);
 //   ft.upload(imageURI, encodeURI("http://192.168.0.109:8084/pfcmobile/FileUpload1"), win, fail, options);
    //        ft.upload(imageURI, encodeURI("http://10.130.2.23:8080/PFCMobile_server/FileUpload"), win, fail, options);
        
    ft.onprogress = function(progressEvent) {
        if (progressEvent.lengthComputable) {
            var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
            $(".loading_text").text("Uploading "+options.fileName+"-"+perc + "%");
        } else {
            if(statusDom.innerHTML == "") {
                $(".loading_text").text("Loading");
            } else {
                $(".loading_text").text($(".loading_text").text()+".");
            }
        }
    };
//    }

}

function win(r) {
    //    alert("Response = " + r.response);
    console.log("Code = " + r.responseCode);
    console.log("Response = " + r.response);
    console.log("Sent = " + r.bytesSent);
    alert(r.response);
    var response = JSON.parse(r.response);
    localStorage.flag = 1;
    localStorage.trxid = response.TRX_ID;
    if(response.data.length){
        localStorage.trxidList = r.response;
    }
    //                var response = JSON.parse(data);
    //                alert(response.response);
    if(response.response == "success"){
        var imageArr = responseData.fileURI;
        //        alert(imageArr.length);
        if(imageArr.length){
            var imageURI = imageArr.pop();
            responseData.fileURI = imageArr;
            $("#loading_screen").hide();
            uploadRemaining(imageURI.URI,response.TRX_ID,imageURI.lineIndex);
        }else{
        	$(".loading_text").text("Loading...");
            $("#error_msg").text(response.response);
            $("#canceldialog").popup('open');
            $("#loading_screen").hide();
            $('#alert_ok').click(function()
            {
                $("#canceldialog").popup('close');
                document.location = "requisitionlist.html";
            });
        }
    }else{
    	    $("#error_msg").text(response.data.status);
            $("#canceldialog").popup('open');
            $("#loading_screen").hide();
            $('#alert_ok').click(function()
            {
                $("#canceldialog").popup('close');
            });
	}
}

function fail(error) {
//    alert("An error has occurred: Code = " + error.code);
//    alert("upload error source : " + error.source);
    fileURI = error.source;
    console.log("upload error source " + error.source);
    console.log("upload error target " + error.target);
    var imageArr = responseData.fileURI;
	$("#error_msg_yes_no").text("Failed to upload file : "+fileURI.substr(imageURI.lastIndexOf('/')+1));
	$('#dialoglink_yes').text("Retry");
	$("#canceldialog_yes_no").popup('open');
	$('#dialoglink_yes').click(function()
	{
	//	alert("Retrying  : " + error.source+" ---------- "+fileURI);
		$("#canceldialog_yes_no").popup('close');
        $("#loading_screen").hide();
        uploadRemaining(error.source,localStorage.trxid,localStorage.lineIndex);
	});      
    $('#dialoglink_no').click(function()
	{
		$("#canceldialog_yes_no").popup('close');
		if(imageArr.length){
            var imageURI = imageArr.pop();
            responseData.fileURI = imageArr;
            $("#loading_screen").hide();
            uploadRemaining(imageURI.URI,localStorage.trxid,imageURI.lineIndex);
        }else{
        	$("#loading_screen").hide();
        	//hide();
	        $("#listitems_div").show();
	        document.location = "requisitionlist.html";
        }
	}); 
    
/*    $("#error_msg").text("Failed to upload file");
    $("#canceldialog").popup('open');
    $('#alert_ok').click(function()
    {
        $("#canceldialog").popup('close');
        if(imageArr.length){
            var imageURI = imageArr.pop();
            responseData.fileURI = imageArr;
            $("#loading_screen").hide();
            uploadRemaining(imageURI,response.TRX_ID)
        }else{
        	$("#loading_screen").hide();
        	hide();
	        $("#listitems_div").show();
        }
    });*/
}



$(document).ready(function()
{
    hide();
    $("#loading_screen").show();
    $("#error_state_msg").hide();
    $("#draft_action_button").hide();
    //    var requestorname = localStorage.requister;
    var requestorname = localStorage.requestorname;
    $("#req_input_name").text(requestorname);
    $("#req_input_id").text(localStorage.requesterid);
    if(plus_flag==0||(itemDescription== "undefined" || itemDescription == ""|| itemDescription == "0"))
    {   // Add new Requisition
        $("#item_description").val("");
        dataExist = true;
    }
    else
    {
        $("#item_description").val(itemDescription);
    }
    if(status_st == "DRAFT"){
        $("#draft_action_button").show();
    }
    if(status_st == "ERROR")
    {
        //            alert(localStorage.error_message);
        if((localStorage.error_message=="")||(localStorage.error_message=="undefined"))
        {
            $("#error_state_msg").html( '*<b>Error</b>: -');
            $("#error_state_msg").show();
        }
        else
        {
            $("#error_state_msg").html( '*<b>Error</b>: '+localStorage.error_message);
            $("#error_state_msg").show();
        }
    }
    else if(!editable)//(status_st != "NEW")//if ((status_st == "APPROVED")||(status_st == "PROCESSED")||(status_st == "INPROCESS") )
    {
        $("#save").hide();
        $("#action_menu").hide();
        $("#accounts_save").hide();
        $("#req_input_id").attr('disabled', true).addClass("disabled_text");
        $("#req_input_name").attr('disabled', true).addClass("disabled_text");
        $("#companyname").css('color', 'gray');
        $("#croptype").css('color', 'gray');
        $("#warehouse_list").attr('disabled', true).addClass("disabled_text");
        $("#item_description").attr('readonly', 'readonly').addClass("disabled_text");
        $("#categorylist").attr('disabled', true).addClass("disabled_text");
        $("#uomlist").attr('disabled', true).addClass("disabled_text");
        $("#crop_year").attr('disabled', true).addClass("disabled_text");
        
        $(".accounts_arrow").removeClass("accounts_arrow");
        $(".list_arrow").removeAttr("src");
        $("#accounts").addClass("accounts_arrow");
        
        $("#attachment_buttons").hide();
    }
    
     $( "#canceldialog_yes_no" ).bind({
        popupafterclose: function(event, ui) {
			$('#dialoglink_yes').text("Ok");
        }
    });
    
    loadData =  function loadData()//Loading of table of contents in listitems first page
    {
        //        $("#loading_screen").show();
        var html = '';
        sum = 0;
        for (var i = 0; i < responseData.data.length; i++)
        {
            var resdata = responseData.data[i];
            html += '<tr onclick="loadItem(' + i + ')">';
            html += ' <td class="items_new_project_table_td list_row_border">';
            html += '<p class="itemname">' + resdata.CATEGORY_DESC + '</p>';
            html += '<p class="rate">Unit Price: '+ (resdata.RATE*1.00).toFixed(4) + '</p>';
            html += '<p class="quantity" >Qty: ' + resdata.QUANTITY + '</p>';
            html += '</td>';
            html += '<td class="items_new_project_table_td table_td_width list_row_border">';
            html += '<p class="total">' + (resdata.AMOUNT*1.00).toFixed(4) + '</p>';
            html += ' <span><img class="list_arrow" src="./images/arrow.png"></span>';
            html += ' </td>';
            html += ' </tr>';
            sum += parseFloat(resdata.AMOUNT);
            req_id = resdata.REQUESTOR_ID;
            creatr_id = resdata.CREATOR_ID;
            $("#req_input_name").text(resdata.FULL_NAME);
        }
        if (plus_flag == 0)
        {
            $("#draft_action_button").show();
            $("#header_title").text("New");
            $("#header_status").text("");
            $("#itemlist_totalamount").text('Total: '+(sum*1.00).toFixed(4));
            $("#number_of_items").text( ' ' +responseData.data.length+'').css('color', 'gray');
            totalList=responseData.data.length
        }
        else
        {
            $("#header_title").text(localStorage.requisitionNumber );
            $("#header_status").text(localStorage.status);
            $("#itemlist_totalamount").text('Total: '+(sum*1.00).toFixed(4));
            $("#number_of_items").text( ' ' +responseData.data.length+'').css('color', 'gray');
            totalList=responseData.data.length
        }
        //         $("#item_header_text").text('Requisition-'+localStorage.requisitionNumber+ ' Line:'+ (parseInt(selectedItem)+1));
        $("#warehouse_list").change(function()//when you are change warehouse other than default warehouse
        {
            for (var i = 0; i < responseData.data.length; i++)
            {
                var resdata = responseData.data[i];
                resdata.ORGANIZATION_ID = $('#warehouse_list').val();
                //   resdata.WAREHOUSE = $('#warehouse_list option:selected').text();
                responseData.data[i] = resdata;
            }
        });

        $("#search_ul").change(function()//when you are change Requistor other than default requistor
        {
            for (var i = 0; i < responseData.data.length; i++)
            {
                var resdata = responseData.data[i];
                resdata.REQUESTOR_ID = req_id;
                resdata.FULL_NAME = $("#req_input_name").text();
                responseData.data[i] = resdata;
            }
            var url = baseURL + 'GetUserDetails';
            var params = '{"requestor_id":"' + req_id + '"}';
            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'jsonp',
                data: 'body=' + params,
                timeout: 30000,
                async: false,
                success: function(data, textStatus, xhr)
                {
                    var response = JSON.parse(data);

                    if (response.response == 'success')
                    {
                        var resdata = response.data;
                        
                        department = resdata.DEPT;
                        activity = resdata.ACTIVITY;
                        project = resdata.PROJECT;
                        account = resdata.ACCOUNT;
                        equipment = resdata.EQUIP;
                        
                        catDept = resdata.DEPT;
                        catAccount = resdata.ACCOUNT;
                        catActivity = resdata.ACTIVITY;
                        catProject = resdata.PROJECT;
                        catEquip = resdata.EQUIP;
                    }
                },
                error: function(request, status, error)
                {
                    hide();
                    $("#loading_screen").hide();
                    //                alert(error);
                    $("#error_msg").text(error);
                    $("#canceldialog").popup('open');
                    $('#alert_ok').click(function()
                    {
                        $("#canceldialog").popup('close');
                    });
                    $("#listitems_div").show();
                }
            });
        });
        if (editable)//((status_st == "ERROR")||(status_st == "NEW"))
        {
            html += ' <tr  id="addnew">';
            html += ' <td class="items_new_project_table_td addnew_border_none">';
            html += ' <a  style="text-decoration:none" >+ Add New</a>';
            html += ' </td>';
            html += ' </tr>';
        }
        $("#itemlist_table").html(html).trigger("create");
        
        for (var j = 0; j < responseData.attachments.length; j++)
        {
            var attachdata = responseData.attachments[j];
            $("#attachment_list").append("<li>"+attachdata.IMAGENAME+"</li>");
        }
        	$('#attachment_list').listview('refresh');
        
        $('#addnew').click(function()//When click on AddNew existing values refresh
        {
            accounts_flag=0;
            $("#error_state_msg_line").hide();
            $("#delete_button").hide();
            $("#account_details").text("");
            itemObj2 = JSON.parse("{}");
            hide();
            $("#categorylist").val("0").selectmenu('refresh');
            $("#uomlist").val("EACH").selectmenu('refresh');
            $("#quantity").val((0 * $('#quantity').val()));
            $("#rate").val((0 * $('#quantity').val() * 1.00).toFixed(4));
            $("#amount").text("0.00");
            $("#description").val("");
            $("#comments").val("");
           
            //            $("#list_header").text('Add NewLine');
            //            $("#accounts_header").text('Add NewAccount');
            $("#listitems_addnew_list").show();
            itemObj = JSON.parse("{}");
            selectedItem = responseData.data.length;
            //            alert(plus_flag);
            if(plus_flag==0)
            {
                $("#list_header").text("Add New ");
                $("#list_header_status").text("");
                $("#accounts_header").text("Add An Account");
                $("#accounts_header_status").text("");
            }
            else
            {
                //                $("#list_header").text(AddNew List +' Line:'+ (parseInt(selectedItem)+1) );
                $("#list_header").text("Add New "+' Line:'+ (parseInt(selectedItem)+1) );
                $("#list_header_status").text("");
                $("#accounts_header").text("Add An Account");
                $("#accounts_header_status").text("");
            }
            var payload = '{"requestor_id":"' + req_id + '"}';
            var callBackReq = function(response){
                if (response.response == 'success')
                {
                    var resdata = response.data;
                        
                    department = resdata.DEPT;
                    activity = resdata.ACTIVITY;
                    project = resdata.PROJECT;
                    account = resdata.ACCOUNT;
                    equipment = resdata.EQUIP;
                        
                    catDept = resdata.DEPT;
                    catAccount = resdata.ACCOUNT;
                    catActivity = resdata.ACTIVITY;
                    catProject = resdata.PROJECT;
                    catEquip = resdata.EQUIP;
                    
                    setAccountValues(department,activity,account,project,equipment,resdata.DEPARTMENT_DESC,resdata.ACTIVITY_DESC,resdata.ACCOUNT_DESC,resdata.PROJECT_DESC,resdata.EQUIP_DESC);
                }
            };
            requestForUserDetails("GetUserDetails",payload,callBackReq);
        });
    }
    
    var requestForUserDetails = function (path,payload,callback){
        var url = baseURL + path;
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'jsonp',
            data: 'body=' + payload,
            timeout: 30000,
            async: false,
            success: function(data, textStatus, xhr)
            {
                var response = JSON.parse(data);
                callback(response);
    
            },
            error: function(request, status, error)
            {
                hide();
                $("#loading_screen").hide();
                //                alert(error);
                $("#error_msg").text(error);
                $("#canceldialog").popup('open');
                $('#alert_ok').click(function()
                {
                    $("#canceldialog").popup('close');
                });
                $("#listitems_div").show();
            }
        });
    }
    
    var url = baseURL + 'GetListItems';//API for list items like warehouse,uom,category
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'jsonp',
        //  data:'approvalsrequest='+params,
        timeout: 30000,
        async: false,
        success: function(data, textStatus, xhr)
        {
            var response = JSON.parse(data);
            //            alert(response);
            if (response.response == 'success')
            {
                hide();

                var html = '';

                html += '<option class="disabled_text" value="0">Select Organization</option>';
                for (var i = 0; i < response.WAREHOUSE.length; i++)
                    html += '<option value="' + response.WAREHOUSE[i].ORGANIZATION_ID + '">(' + response.WAREHOUSE[i].ORGANIZATION_CODE+')'+response.WAREHOUSE[i].ORGANIZATION_DESCRIPTION+ '</option>';
                $("#warehouse_list").html(html);
                html = '<option class="disabled_text" value="0">Select Category</option>';
                for (var i = 0; i < response.CATEGORY.length; i++)
                    html += '<option value="' + response.CATEGORY[i].SEGMENT1 + '">' + response.CATEGORY[i].SEGMENT1 + '</option>';
                $("#categorylist").html(html);
                html = '<option class="disabled_text" value="0">Select UOM</option>';
                for (var i = 0; i < response.UOM.length; i++)
                    html += '<option value="' + response.UOM[i] + '">' + response.UOM[i] + '</option>';
                $("#uomlist").html(html);
                
                
                if(dataExist){
                    $("#loading_screen").hide();
                    setTimeout(function(){
                        $("#listitems_div").show();
                    },1);
                }
                dataExist = true;
                $("#warehouse_list").selectmenu();
                $("#warehouse_list").val(localStorage.organizationid).selectmenu('refresh');
            }
        },
        error: function(request, status, error)
        {
            $("#loading_screen").hide();
            //                alert(error);
            $("#error_msg").text(error);
            $("#canceldialog").popup('open');
            $('#alert_ok').click(function()
            {
                $("#canceldialog").popup('close');
                hide();
                document.location = "requisitionlist.html";
            });
        //alert(error);
        }
    });
    var url = baseURL + 'GetRequisitionDetails';//ApI for load data items 
    var tx_id = localStorage.trxid;
    req_id = localStorage.requesterid;
    var org_id = localStorage.organizationid;
    var params = '{"requestor_id":"' + req_id + '","trx_id":"' + tx_id + '"}';
  
    if (parseInt(plus_flag))
    {
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'jsonp',
            data: 'body=' + params,
            timeout: 30000,
            async: false,
            success: function(data, textStatus, xhr)
            {
                var response = JSON.parse(data);
                if (response.response == 'success')
                {
                    responseData = response;
                    loadData();
                }else{
               		$("#error_msg").text(response.data.status);
                	$("#canceldialog").popup('open');
                	$('#alert_ok').click(function()
                	{
                    	$("#canceldialog").popup('close');
                    });
            	}
                if(dataExist){
                    $("#loading_screen").hide();
                    $("#listitems_div").show();
                }
                dataExist = true;
            },
            error: function(request, status, error)
            {
                $("#loading_screen").hide();
                //                alert(error);
                $("#error_msg").text(error);
                $("#canceldialog").popup('open');
                $('#alert_ok').click(function()
                {
                    $("#canceldialog").popup('close');
                    hide();
                    document.location = "requisitionlist.html";
                });
            }
        });
    }
    else
    {
        dataExist = true;
        $("#req_input_id").text(localStorage.requesterid);
        creatr_id = localStorage.creatorid;
        loadData();
    }
                  
    $('#categorylist').change(function(){
            var list = new Array("RENTAL EQUIPMENT", "RENTAL TOILETS", "SERVICES", "RENTAL EQP - ALMOND DRYING");
            var selectedCategory = $('#categorylist option:selected').text();
            //        if(selectedCategory == "RENTAL EQUIPMENT" || selectedCategory == "RENTAL TOILETS" || selectedCategory == "SERVICES"){
            if($.inArray(selectedCategory, list) > -1){
            $("#rate").val(1.00).attr('readonly', 'readonly').addClass("disabled_text");
            $("#amount").text((parseFloat($('#rate').val()) * parseFloat($('#quantity').val())).toFixed(4));
        }else{
            $("#rate").removeAttr('readonly').removeClass("disabled_text");
        }
        if(selectedCategory == "CAPITAL ITEM"){
            $("#proj_input_id").text("");
        }else{
            $("#proj_input_id").text("0000");
        }
        var callback = function (response){
            catDept = response.data.dept;
            catActivity = response.data.act;
            catAccount = response.data.acc;
            catProject = response.data.proj;
            catEquip = response.data.equip;
            setAccountValues(catDept,catActivity,catAccount,catProject,catEquip,response.data.deptdesc,response.data.actdesc,response.data.accdesc,response.data.projdesc,response.data.equipdesc);
            setAccessibility(response.data.updatedept,response.data.updateact,response.data.updateacc,response.data.updateproj,response.data.updateequip);
        }
        requestAccFromCategory(selectedCategory,callback);
    });
    
    $('#cancel').click(function()//back button in list items(category, uom,unit price, quantity...)
    {
        var addnew_list=$("#categorylist").val()=="0"&&$("#uomlist").val()=="EACH"&&$("#quantity").val()=="0"&&$("#rate").val()=="0.00"&&$("#description").val()=="";
        // if ( ((status_st != "ERROR")&&(status_st != "NEW"))||(comp_category==$("#categorylist").val()&&comp_uom==$("#uomlist").val()&& comp_quantity==$("#quantity").val()&&comp_rate==$("#rate").val()&& comp_description==$("#description").val())||addnew_list)
        if ( (!editable)||(comp_category==$("#categorylist").val()&&comp_uom==$("#uomlist").val()&& comp_quantity==$("#quantity").val()&&comp_rate==$("#rate").val()&& comp_description==$("#description").val())||addnew_list)
        {
            selectedItem = -2;
            hide();
            $("#listitems_div").show();
        }
        else
        {
            $("#error_msg_yes_no").text(alert_msg);
            $("#canceldialog_yes_no").popup('open');
            $('#dialoglink_yes').click(function()
            {
                selectedItem = -2;
                hide();
                $("#listitems_div").show();
                $("#canceldialog_yes_no").popup('close');
            //                $("#canceldialog_yes_no").hide();
            });  
        }
    });
    $('#accounts').click(function()//when click on account fields defaults/exsting values stored in accounts fields
    {

        var category = $('#categorylist option:selected').text();

        
        /*        if ((category == "OVERHEAD SUPPLIES")&&(accounts_flag==0))
                          {
            $("#dept_input_id").text(catDept);
            $("#act_input_id").text(catActivity);
            $("#account_account").text(catAccount);
            $("#proj_input_id").text(catActivity);
            $("#equip_input_id").text(catActivity);
            itemObj2.DEPT = catDept;
            itemObj2.ACTIVITY = catActivity;
            itemObj2.ACCOUNT = catAccount;
                          }*/
        if(category == "Select Category"){
            $("#error_msg").text("Please select category");
            $("#canceldialog").popup('open');
            $('#alert_ok').click(function()
            {
                $("#canceldialog").popup('close');
            });
            
        }
        else{
            hide();
            if(editable){
            
                $("#loading_screen").show();
                var callback = function (response){
                    $("#listitems_accounts").show();
                    $("#loading_screen").hide();
                    catDept = response.data.dept;
                    catActivity = response.data.act;
                    catAccount = response.data.acc;
                    catProject = response.data.proj;
                    catEquip = response.data.equip;
                    catDeptDesc = response.data.deptdesc;
                    catActivityDesc = response.data.actdesc;
                    catAccountDesc = response.data.accdesc;
                    catProjectDesc = response.data.projdesc;
                    catEquipDesc = response.data.equipdesc;
                    setAccessibility(response.data.updatedept,response.data.updateact,response.data.updateacc,response.data.updateproj,response.data.updateequip);
                }
                requestAccFromCategory(category,callback);
            }else{
                $("#redefault_button").hide();
                $("#listitems_accounts").show();
            }
        }
    });
    $('#listitemsback').click(function()//back button in listitems first page
    {
        // if ((status_st =ROVED")||(status_st == "PROCESSED")||(status_st == "INPROCESS")||($("#number_of_items").text()==totalList))
        //if (((status_st != "ERROR")&&(status_st != "NEW"))||($("#number_of_items").text()==totalList))
        if ((!editable)||($("#number_of_items").text()==totalList))
        {
            document.location = "requisitionlist.html";
        }
        else
        {
            $("#error_msg_yes_no").text(alert_msg);
            $("#canceldialog_yes_no").popup('open'); 
            $('#dialoglink_yes').click(function()
            {
                document.location = "requisitionlist.html";
            //   alert("click");
            //   setTimeout(function(){document.location = "requisitionlist.html";},500);
            });
        }
    });
    $('#accounts_back').click(function()//back button in accounts field
    {
        var addnew_accounts=$("#dept_input_id").text()=="Select Department"&&$("#act_input_id").text()=="Select Activity"&&$("#proj_input_id").text()=="0000"&&$("#equ_input_id").text()=="Select Equipment"&&$("#crop_year").val()==year.toString()&&$("#account_account").text()=="0000";

        hide();
        $("#listitems_addnew_list").show();
    });  

    $('#forpopup_td').click(function()//when click on Select Requistor
    {
        if (editable)//((status_st == "ERROR")||(status_st == "NEW"))
        {
            hide();
            $("#listitems_requister").show();
            requestor();
        }
        else
        {
            $("#req_input_id").attr('readonly', true);
        }
    });
    $('#req_backimg').click(function()//Back button in requistor search field
    {
        hide();
        $("#listitems_div").show();
    });
    $('#dept_backimg').click(function()//Back button in department search field
    {
        hide();
        $("#listitems_accounts").show();
    });
    $('#act_backimg').click(function()//Back button in activity search field
    {
        hide();
        $("#listitems_accounts").show();
    });
    $('#proj_backimg').click(function()//Back button in project search field
    {
        hide();
        $("#listitems_accounts").show();
    });
    $('#equ_backimg').click(function()//Back button in equipment search field
    {
        hide();
        $("#listitems_accounts").show();
    });
    $('#acc_backimg').click(function()//Back button in Account search field
    {
        hide();
        $("#listitems_accounts").show();
    });

    $('#comments_department').click(function()//department property approved and processed/other
    {
        if (editable && $(this).hasClass("accounts_arrow"))//((status_st == "ERROR")||(status_st == "NEW"))
        {
            hide();
            $("#listitems_comments_department").show();
            searchDepartment();
        }
        else
        {
            $("#dept_input_id").attr('readonly', true);
        }
    });
    $('#comments_activity').click(function()//Activity property approved and processed/other
    {
        var selectedCategory = $('#categorylist option:selected').text();
        // if (((status_st == "ERROR")||(status_st == "NEW")) && (selectedCategory != "RENTAL EQUIPMENT" && selectedCategory != "RENTAL TOILETS"))
        if (editable && $(this).hasClass("accounts_arrow") && (selectedCategory != "RENTAL EQUIPMENT" && selectedCategory != "RENTAL TOILETS"))
        {
            hide();
            $("#listitems_comments_activity").show();
            searchActivity();
        }
        else
        {
            $("#act_input_id").attr('readonly', true);
        }
    });
    $('#comments_eqipment').click(function()//eqiupment property approved and processed/other
    {
        if (editable && $(this).hasClass("accounts_arrow"))//((status_st == "ERROR")||(status_st == "NEW"))
        {
            hide();
            $("#listitems_accounts_equipment").show();
            searchEquipment();
        }
        else
        {
            $("#equ_input_id").attr('readonly', true);
        }
    });
    $('#comments_project').click(function()//project property approved and processed/other
    {
        if (editable && $(this).hasClass("accounts_arrow"))//((status_st == "ERROR")||(status_st == "NEW"))
        {
            hide();
            $("#listitems_accounts_project").show();
            searchProject();
        }
        else
        {
            $("#proj_input_id").attr('readonly', true);
        }
    });
    $('#comments_account').click(function()//project property approved and processed/other
    {
        if (editable && $(this).hasClass("accounts_arrow"))//((status_st == "ERROR")||(status_st == "NEW"))
        {
            hide();
            $("#listitems_accounts_account").show();
            searchAccount();
        }
        else
        {
            $("#account_account").attr('readonly', true);
        }
    });
    function submitRequisition(mode){
        for(var i=0;i<responseData.data.length;i++)
        {
 //           responseData.data[i].CREATOR_ID=creatr_id;//CREATOR=localStorage.creatorid;
            var headerDesc = $("#item_description").val().replace(/\"/g, '\"');//(/\"/g, '\\"');
            responseData.data[i].DESCRIPTION=encodeURIComponent(headerDesc);
            responseData.data[i].ORGANIZATION_ID = $('#warehouse_list').val();
            responseData.data[i].REQUESTOR_ID = $("#req_input_id").text();//req_id;
            responseData.data[i].STATE = mode;
            
            var cmts = responseData.data[i].COMMENTS;
            cmts = (cmts==undefined)?"":cmts;
            responseData.data[i].COMMENTS = encodeURIComponent(cmts.replace(/\"/g, '\"'));//(/\"/g, '\\"'));
            var descript = responseData.data[i].CATEGORY_DESC;
            descript = (descript==undefined)?"":descript;
            responseData.data[i].CATEGORY_DESC = encodeURIComponent(descript.replace(/\"/g, '\"'));//(/\"/g, '\\"'));
        }
        //  alert(JSON.stringify(responseData));
        var warehouseVal = $('#warehouse_list').val();
        if(warehouseVal != '0' && responseData.data.length != 0){
            hide();
            $("#loading_screen").show();
                                   
            if(responseData.fileURI == undefined || responseData.fileURI == 'undefined' || responseData.fileURI.length == 0){
                var url = baseURL + 'Update';
                $.ajax({
                    url: url,
                    type: 'GET',
                    dataType: 'jsonp',
                    data: 'body=' + encodeURIComponent(JSON.stringify(responseData)),
                    timeout: 30000,
                    async: false,
                    success: function(data, textStatus, xhr)
                    {
                        //     alert(data);
                        var response = JSON.parse(data);
                        if(response.response == "success"){
                            localStorage.flag = 1;
                            localStorage.trxid = response.data[0].TRX_ID;
                            $("#error_msg").text(response.response);
                            $("#canceldialog").popup('open');
                            $("#loading_screen").hide();
                            $('#alert_ok').click(function()
                            {
                                $("#canceldialog").popup('close');
                                document.location = "requisitionlist.html";
                            });
                        }else{
                            $("#error_msg").text(response.data.status);
                            $("#canceldialog").popup('open');
                            $("#loading_screen").hide();
                            $('#alert_ok').click(function()
                            {
                                $("#canceldialog").popup('close');
                            //   document.location = "requisitionlist.html";
                            });
                            $("#listitems_div").show();
                        }
                    //                var response = JSON.parse(data);
                    //                alert(response.response);
                    
                    //alert("Thanks!your request updated");
                    },
                    error: function(request, status, error)
                    {
                        $("#loading_screen").hide();
                        //                alert(error);
                        $("#error_msg").text(error);
                        $("#canceldialog").popup('open');
                        $('#alert_ok').click(function()
                        {
                            $("#canceldialog").popup('close');
                        });
                        hide();
                        $("#listitems_div").show();
                    }

                });
            }else{
                var imageArr = responseData.fileURI;
                var imageURI = imageArr.pop();
                fileURI = imageURI;
                responseData.fileURI = imageArr;
                var options = new FileUploadOptions();
                options.fileKey="file";
                options.fileName=imageURI.URI.substr(imageURI.URI.lastIndexOf('/')+1);
                options.mimeType="image/jpeg";
               
                var params = {};
                params.lineIndex = imageURI.lineIndex;alert(params.lineIndex);
                params.body = JSON.stringify(responseData);
                //'{"response":"success","data":[{"REQUESTOR_ID":501,"ACTIVITY":"0000","CROP_TYPE":"101","PROJECT":"000027","TRX_LINE_ID":30,"ACCOUNT":"80510","CATEGORY":"RENTAL TOILETS","WAREHOUSE":"NCW","CROP_YEAR":"2013","ORGANIZATION_ID":102,"QUANTITY":2,"COMPANY":"010","FUTURE":"0000","RATE":650,"FULL_NAME":"PFC_User, PFC_New","DESCRIPTION":"Test description","COMMENTS":"comentyyu6","INTF_STATUS":"ERROR","EQUIP_CLASS":"ALL","ERROR_MESSAGE":" CHARGE OF ACCOUNT is not valid ORA-01403: no data found","AMOUNT":1300,"DEPT":"3191","TRX_ID":24,"CATEGORY_DESC":"test second item","UOM":"Monthly"}]}';
                //    params.callback = "";
               
                options.params = params;
                localStorage.trxidList = '{"data":[]}';
                var url = baseURL + 'FileUpload1';
                //               url = "http://192.168.0.109:8084/pfcmobile/FileUpload1";
                var ft = new FileTransfer();
                ft.upload(imageURI.URI, encodeURI(url), win, fail, options);
                //        ft.upload(imageURI, encodeURI("http://10.130.2.23:8080/PFCMobile_server/FileUpload"), win, fail, options);
                                   
                ft.onprogress = function(progressEvent) {
					if (progressEvent.lengthComputable) {
						var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
						$(".loading_text").text("Uploading "+options.fileName+"-"+perc + "%");
					} else {
						if(statusDom.innerHTML == "") {
							$(".loading_text").text("Loading");
						} else {
							$(".loading_text").text($(".loading_text").text()+".");
						}
					}
                };
            }
        }else{
            $("#error_msg").text("Please select Warehouse,Requester and add atleast one Item");
            $("#canceldialog").popup('open');
            $('#alert_ok').click(function()
            {
                $("#canceldialog").popup('close');
            });
        }
    }
    $('#save_action_button').click(function()//for saving of requistor entered all requisitions
    {
        var mode = status_st;
        if(status_st == "DRAFT" || status_st == "ERROR" || status_st == "NEW"){
            mode = "SUBMITTED";
        }
        submitRequisition(mode);
    });
    $('#draft_action_button').click(function()//for saving of requistor entered all requisitions
    {
        submitRequisition("DRAFT");
    });
    $('#rate').focus(function()//if rate is 0.00 then it is cleared
    {
        if($("#rate").val()==0)
        {
            $("#rate").val("");
        }
    });
    $('#quantity').focus(function()//if quantity is 0 then it is cleared
    {
        if($("#quantity").val()==0)
        {
            $("#quantity").val("");
        }
    });
    $('#rate').blur(function()//when you are entered rate value added decimals and calculate amount
    {
        var rate = parseFloat($('#rate').val());
        rate = isNaN(parseFloat(rate))?0:rate.toFixed(4);
        $("#rate").val(rate);
        // $("#rate").val(($('#rate').val() * 1.00).toFixed(4));
        $("#amount").text((rate * $('#quantity').val() * 1.00).toFixed(4));
    });
    $('#quantity').blur(function()//when you are entered Quantity value added decimals and calculate amount
    {
        var quant = parseFloat($('#quantity').val());
        quant = isNaN(parseFloat(quant))?0:quant.toFixed(4);
        $("#quantity").val(quant);
        $("#amount").text(($('#rate').val() * quant * 1.00).toFixed(4));
    });

    function validateAccountsCode(callBack){
        hide();
        var params = '{"dept":"'+$("#dept_input_id").text()+'","act":"'+$("#act_input_id").text()+'","acc":"'+$("#account_account").text()+'","proj":"'+$("#proj_input_id").text()+'","equip":"'+$("#equ_input_id").text()+'","orgid":"'+$("#warehouse_list").val()+'"}';
        var url = baseURL + 'ValidateAccCombination';
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'jsonp',
            data: 'body=' + params,
            timeout: 30000,
            async: false,
            success: function(data, textStatus, xhr)
            {
                callBack(true,data,'');
            },
            error: function(request, status, error)
            {
                callBack(false,'',error);
            }
        });
    }

    $('#save').click(function()//Click function for save button in list details(category,UOM ,unit price...)
    {
        var categoryVal = $("#categorylist").val();
        var uomVal = $("#uomlist").val();
        var quantityVal = $("#quantity").val();
        var rateVal = $("#rate").val();
        var amountVal = $("#amount").text();
        var descVal = encodeURIComponent($("#description").val().replace(/\"/g, '\\"'));
        if ((categoryVal == 0 || uomVal.length == 0 || (parseFloat(quantityVal)== 0) || (parseFloat(rateVal)== 0) || descVal.length == 0) )
        {
            //            alert('please enter all fields');
            $("#error_msg").text("Please Enter All Fields");
            $("#canceldialog").popup('open');
            $('#alert_ok').click(function()
            {
                $("#canceldialog").popup('close');
            });
            hide();
            $("#listitems_addnew_list").show();
        }
        else
        {
            hide();
            $("#loading_screen").show();
            var accCodeValidationOnSave = function(isSuccess,data,error){
                if(isSuccess){
                    var response = JSON.parse(data);
                    $("#loading_screen").hide();
                    if(response.response != "success"){
                        $("#error_msg").text(response.status+' ('+response.count+')');
                        $("#canceldialog").popup('open');
                        $('#alert_ok').click(function(){
                            $("#canceldialog").popup('close');
                        });
                        $("#listitems_addnew_list").show();
                    }else{
                        itemObj.FUTURE = "000000";
                        itemObj.FULL_NAME = $("#req_input_name").text();
                        itemObj.RATE = $("#rate").val();
                        //            itemObj.ERROR_MESSAGE = "";
                        itemObj.AMOUNT = $("#amount").text();
                        //       alert(itemObj.TRX_ID +'-----'+itemObj.TRX_LINE_ID);
                        if (itemObj.TRX_ID == 'undefined' || itemObj.TRX_ID == undefined)
                        {
                            itemObj.TRX_ID = localStorage.trxid;
                            itemObj.TRX_LINE_ID = 0;
                        }
                        if (itemObj.TRX_LINE_ID == 'undefined' || itemObj.TRX_LINE_ID == undefined)
                        {
                            itemObj.TRX_ID = localStorage.trxid;
                            itemObj.TRX_LINE_ID = 0;
                        }
                        //        alert(itemObj.TRX_ID +'-----'+itemObj.TRX_LINE_ID);
                        itemObj.COMMENTS = $("#comments").val();
                        itemObj.CATEGORY_DESC = $("#description").val();
                        //            itemObj.COMMENTS = encodeURIComponent($("#comments").val().replace(/\"/g, '\\"'));
                        //            itemObj.CATEGORY_DESC = encodeURIComponent($("#description").val().replace(/\"/g, '\\"'));
                        //            itemObj.DESCRIPTION = $("#item_description").val();
                        itemObj.CATEGORY = $("#categorylist").val();
                        itemObj.WAREHOUSE = $('#warehouse_list option:selected').text();
                        itemObj.QUANTITY = $("#quantity").val();
                        itemObj.UOM = $('#uomlist option:selected').text();
                        itemObj.INTER_ORG = "";
                        itemObj.ORGANIZATION_ID = $("#warehouse_list").val();
                        //           itemObj.COMPANY = $("#companyname").text();
                        //            itemObj.CROP_TYPE = $("#croptype").text();
                        /*            itemObj.DEPT = itemObj2.DEPT;
 itemObj.ACTIVITY = itemObj2.ACTIVITY;
 itemObj.EQUIP_CLASS = itemObj2.EQUIP_CLASS;
 itemObj.PROJECT = itemObj2.PROJECT;
 //            itemObj.CROP_YEAR = itemObj2.CROP_YEAR;
 itemObj.ACCOUNT = itemObj2.ACCOUNT;*/
                     
                        itemObj.DEPT = $("#dept_input_id").text();
                        itemObj.ACTIVITY = $("#act_input_id").text();
                        itemObj.EQUIP_CLASS = $("#equ_input_id").text();
                        itemObj.PROJECT = $("#proj_input_id").text();
                        itemObj.ACCOUNT = $("#account_account").text();
                     
                        itemObj.DEPARTMENT_DESC = $("#dept_input_name").text();
                        itemObj.ACTIVITY_DESC = $("#act_input_name").text();
                        itemObj.EQUIP_DESC = $("#equip_input_name").text();
                        itemObj.PROJECT_DESC = $("#proj_input_name").text();
                        itemObj.ACCOUNT_DESC = $("#acc_input_name").text();

                        itemObj.REQUESTOR_ID = localStorage.requesterid;
                        itemObj.CREATOR_ID = creatr_id;
                        //       alert(JSON.stringify(itemObj));
                        responseData.data[selectedItem] = itemObj;
                        selectedItem = -2;
                        $("#listitems_div").show();
                    }
                }else{
                    $("#loading_screen").hide();
                    $("#error_msg").text(error);
                    $("#canceldialog").popup('open');
                    $('#alert_ok').click(function(){
                        $("#canceldialog").popup('close');   
                    });
                    $("#listitems_addnew_list").show();
                }
                loadData();
            };
            validateAccountsCode(accCodeValidationOnSave);
            
        }
    });
    $('#accounts_save').click(function()//click function for save button in accounts fields
    {
        hide();
        if ($("#dept_input_id").text().length && $("#act_input_id").text().length  && $("#account_account").text().length/* && $("#proj_input_id").text().length*/ && $("#equ_input_id").text().length)
        {
            $("#save_action_button").show();
            $("#loading_screen").show();
            $("#account_details").text($("#dept_input_id").text()+'-'+$("#act_input_id").text()+'-'+$("#account_account").text()+'-'+$("#proj_input_id").text()+'-'+$("#equ_input_id").text());
            var accCodeValidation = function(isSuccess,data,error){
                if(isSuccess){
                    var response = JSON.parse(data);
                    $("#loading_screen").hide();
                    if(response.response == "success"){
                        $("#listitems_addnew_list").show();
                    }else{
                        if(plus_flag == 0)
                            $("#save_action_button").hide();
                        $("#listitems_accounts").show();
                        $("#error_msg").text(response.status+' ('+response.count+')');
                        $("#canceldialog").popup('open');
                        $('#alert_ok').click(function(){
                            $("#canceldialog").popup('close');
                        });
                    }
                }else{
                    $("#loading_screen").hide();
                    $("#error_msg").text(error);
                    $("#canceldialog").popup('open');
                    $('#alert_ok').click(function(){
                        $("#canceldialog").popup('close');                    
                    });
                }
            };
            validateAccountsCode(accCodeValidation);
        }
        else
        {
            //            alert("Please select all fields");
            hide();
            $("#error_msg").text("Please Enter All Fields");
            $("#canceldialog").popup('open');
            $('#alert_ok').click(function(){
                $("#canceldialog").popup('close');
            });
            $("#listitems_accounts").show();
        }
    });
    $('#search_emp').click(function()//click for Search Requistor
    {
        requestor();
    });
  

    $('#search_dept').click(function()//click for Search Department
    {
        searchDepartment();
    });
    $('#search_act').click(function()//click for Search Activity
    {
        searchActivity();
    });

    $('#search_proj').click(function()//click for Search Project
    {
        searchProject();
    });
 

    $('#search_equ').click(function()// click for Search Equipment
    {
        searchEquipment();
    });
    $('#search_acc').click(function()// click for Search Equipment
    {
        searchAccount();
    });
    function requestor()//Requistor API
    {
        hide();
        $("#loading_screen").show();
        var empName = $("#emp_text").val();
        var url = baseURL + 'GetAccounts';
        var params = '{"search_string":"' + encodeURIComponent(empName) + '",\"search_element\":\"requestor\"}';
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'jsonp',
            data: 'body=' + params,
            timeout: 30000,
            async: false,
            success: function(data, textStatus, xhr)
            {
                var response = JSON.parse(data);

                if (response.response == 'success')
                {
                    $("#loading_screen").hide();
                    $("#listitems_requister").show();
                    var html = '';
                    for (var i = 0; i < response.REQUESTER.length; i++)
                    {
                        html += '<li class="poplist_li" onclick="requisterid(\'' + response.REQUESTER[i].PERSON_ID + '\',\'' + response.REQUESTER[i].FULL_NAME + '\')"><p class="list_ui_id">' + response.REQUESTER[i].PERSON_ID + '</p><div data-role="none" class="list_ui_div"><p class="list_ui_names">' + response.REQUESTER[i].FULL_NAME + '</p></div></li>';
                    }

                    $("#search_ul").html(html);
                }
            },
            error: function(request, status, error)
            {
                hide();
                $("#loading_screen").hide();
                //                alert(error);
                $("#error_msg").text(error);
                $("#canceldialog").popup('open');
                $('#alert_ok').click(function()
                {
                    $("#canceldialog").popup('close');
                });
                $("#listitems_div").show();
            }
        });
    }
    function makeRequestForAccounts(payload,callback){
        var url = baseURL + 'GetAccounts';
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'jsonp',
            data: 'body=' + payload,
            timeout: 30000,
            async: false,
            success: function(data, textStatus, xhr)
            {
                var response = JSON.parse(data);
                if (response.response == 'success')
                {
                    $("#loading_screen").hide();
                    callback(response);
                }
            },
            error: function(request, status, error)
            {
                hide();
                $("#loading_screen").hide();
                //                alert(error);
                $("#error_msg").text(error);
                $("#canceldialog").popup('open');
                $('#alert_ok').click(function()
                {
                    $("#canceldialog").popup('close');
                });
                $("#listitems_accounts").show();
            }
        });
    }
    function searchDepartment()//Department API
    {
        hide();
        $("#loading_screen").show();
        var depText = $("#dept_text").val();
        var params = '{"search_string":"' + encodeURIComponent(depText) + '",\"search_element\":\"dept\"}';
        var callBackReq = function(response){
            $("#listitems_comments_department").show();
            var html = '';
            for (var i = 0; i < response.DEPARTMENT.length; i++)
            {
                html += '<li class="poplist_li"   onclick="departmentSelected(\'' + response.DEPARTMENT[i].DEPARTMENT_CODE + '\',\'' + response.DEPARTMENT[i].DEPARTMENT_DESC + '\')"><p class="list_ui_id">' + response.DEPARTMENT[i].DEPARTMENT_CODE + '</p><div data-role="none" class="list_ui_div"><p class="list_ui_names">' + response.DEPARTMENT[i].DEPARTMENT_DESC + '</p></div></li>';
            }
            $("#department_search").html(html);
        };
        makeRequestForAccounts(params, callBackReq);

    }
    function searchActivity()//Activity API
    {
        hide();
        $("#loading_screen").show();
        var actText = $("#act_text").val();
        
        var params = '{"search_string":"' + encodeURIComponent(actText) + '",\"search_element\":\"activity\"}';
        var callBackReq = function(response){
            $("#listitems_comments_activity").show();
            var html = '';
            for (var i = 0; i < response.ACTIVITY.length; i++)
            {
                html += '<li class="poplist_li"  onclick="activitySelected(\'' + response.ACTIVITY[i].ACTIVITY_CODE + '\',\'' + response.ACTIVITY[i].ACTIVITY_DESC + '\')"><p class="list_ui_id">' + response.ACTIVITY[i].ACTIVITY_CODE + '</p><div data-role="none" class="list_ui_div"><p class="list_ui_names">' + response.ACTIVITY[i].ACTIVITY_DESC + '</p></div></li>';
            }
            $("#activity_search").html(html);
        };
        makeRequestForAccounts(params, callBackReq);

    }
    function searchProject()//Project API
    {
        hide();
        $("#loading_screen").show();
        var proText = $("#proj_text").val();
        
        var params = '{"search_string":"' + encodeURIComponent(proText) + '",\"search_element\":\"project\"}';
        var callBackReq = function(response){
            $("#listitems_accounts_project").show();
            html = '';
            for (var i = 0; i < response.PROJECT.length; i++)
            {
                html += '<li class="poplist_li"  onclick="projectSelected(\'' + response.PROJECT[i].PROJECT_CODE + '\',\'' + response.PROJECT[i].PROJECT_DESC + '\')"><p class="list_ui_id">' + response.PROJECT[i].PROJECT_CODE + '</p><div data-role="none" class="list_ui_div"><p class="list_ui_names">' + response.PROJECT[i].PROJECT_DESC + '</p></div></li>';
            }
            $("#project_search").html(html);
        };
        makeRequestForAccounts(params, callBackReq);
                    
    }
    function searchEquipment()//Eqipment API
    {
        hide();
        $("#loading_screen").show();
        var equText = $("#equ_text").val();
        
        var params = '{"search_string":"' + encodeURIComponent(equText) + '",\"search_element\":\"equip\"}';
        var callBackReq = function(response){
            $("#listitems_accounts_equipment").show();
            html = '';
            for (var i = 0; i < response.EQUIPMENT.length; i++)
            {
                html += '<li class="poplist_li"  onclick="equipmentSelected(\'' + response.EQUIPMENT[i].EQUIP_CODE + '\',\'' + response.EQUIPMENT[i].EQUIP_DESC + '\')"><p class="list_ui_id">' + response.EQUIPMENT[i].EQUIP_CODE + '</p><div data-role="none" class="list_ui_div"><p class="list_ui_names">' + response.EQUIPMENT[i].EQUIP_DESC + '</p></div></li>';

            }
            $("#equipment_search").html(html);
        };
        makeRequestForAccounts(params, callBackReq);
                    
    }
    function searchAccount(){
        hide();
        $("#loading_screen").show();
        var accText = $("#acc_text").val();
        
        var params = '{"search_string":"' + encodeURIComponent(accText) + '",\"search_element\":\"account"}';
        var callBackReq = function(response){
            $("#listitems_accounts_account").show();
            html = '';
            for (var i = 0; i < response.ACCOUNT.length; i++)
            {
                html += '<li class="poplist_li"  onclick="accountSelected(\'' + response.ACCOUNT[i].ACCOUNT_CODE + '\',\'' + response.ACCOUNT[i].ACCOUNT_DESC + '\')"><p class="list_ui_id">' + response.ACCOUNT[i].ACCOUNT_CODE + '</p><div data-role="none" class="list_ui_div"><p class="list_ui_names">' + response.ACCOUNT[i].ACCOUNT_DESC + '</p></div></li>';

            }
            $("#account_search").html(html);
        };
        makeRequestForAccounts(params, callBackReq);

    }
    $('#delete_yes').click(function()
    {
        $("#delete_dialog").popup('close');
        deleteLine();
    });
});
function loadItem(item)//Loading of existing/Default/New values in all fields
{
    accounts_flag=1;
    selectedItem = item;
    itemObj = responseData.data[item];
    alert(itemObj.lineattachments);
    // if ((status_st == "APPROVED")||(status_st == "PROCESSED")||(status_st == "INPROCESS"))
    if (!editable)//((status_st != "ERROR")&&(status_st != "NEW"))
    {
        $("#list_header").text(localStorage.requisitionNumber+' Line:'+ (parseInt(selectedItem)+1) );
        $("#list_header_status").text(localStorage.status);
        $("#accounts_header").text("Account Details");
        $("#accounts_header_status").text(localStorage.status);
        $("#delete_button").hide();
    }
    else
    {
        $("#delete_button").show();
        $("#list_header").text('Edit Line:'+ (parseInt(selectedItem)+1) );
        $("#list_header_status").text(localStorage.status);
        $("#accounts_header").text("Edit Account");
        $("#accounts_header_status").text(localStorage.status);
    }
    //    $("#item_header_text").text('Requisition-' + localStorage.requisitionNumber + ' Line:' + (parseInt(selectedItem) + 1));
    itemObj2 = JSON.parse("{}");
    if (selectedItem < responseData.data.length)
    {
        //       itemObj2.COMPANY = itemObj.COMPANY;
        //       itemObj2.CROP_TYPE = itemObj.CROP_TYPE
        itemObj2.DEPT = itemObj.DEPT;
        itemObj2.ACTIVITY = itemObj.ACTIVITY;
        itemObj2.EQUIP_CLASS = itemObj.EQUIP_CLASS;
        itemObj2.PROJECT = itemObj.PROJECT;
        //       itemObj2.CROP_YEAR = itemObj.CROP_YEAR;
        itemObj2.ACCOUNT = itemObj.ACCOUNT;
    }
    //      //alert(itemObj);
    comp_category=itemObj.CATEGORY;
    $("#categorylist").val(comp_category).selectmenu('refresh');
    comp_uom=itemObj.UOM;
    $("#uomlist").val(comp_uom).selectmenu('refresh');
    //    comp_cropyear=itemObj.CROP_YEAR;
    //    $("#crop_year").val(comp_cropyear).selectmenu('refresh');
    //if ((status_st == "APPROVED")||(status_st == "PROCESSED")||(status_st == "INPROCESS"))
    if (!editable)//((status_st != "ERROR")&&(status_st != "NEW"))
    {
        $("#quantity").val(itemObj.QUANTITY).attr('readonly', 'readonly').addClass("disabled_text");
        $("#rate").val((itemObj.RATE*1.00).toFixed(4)).attr('readonly', 'readonly').addClass("disabled_text");
        $("#amount").text((itemObj.AMOUNT*1.00).toFixed(4)).attr('readonly', 'readonly').addClass("disabled_text");
        $("#dept_input_id").text(itemObj.DEPT).attr('readonly', 'readonly').addClass("disabled_text");
        $("#act_input_id").text(itemObj.ACTIVITY).attr('readonly', 'readonly').addClass("disabled_text");
        $("#account_account").text( itemObj.ACCOUNT).attr('readonly', 'readonly').addClass("disabled_text");
        $("#proj_input_id").text(itemObj.PROJECT).attr('readonly', 'readonly').addClass("disabled_text");
        $("#equ_input_id").text(itemObj.EQUIP_CLASS).attr('readonly', 'readonly').addClass("disabled_text");
        
        $("#dept_input_name").text(itemObj.DEPARTMENT_DESC).attr('readonly', 'readonly').addClass("disabled_text");
        $("#act_input_name").text(itemObj.ACTIVITY_DESC).attr('readonly', 'readonly').addClass("disabled_text");
        $("#acc_input_name").text( itemObj.ACCOUNT_DESC).attr('readonly', 'readonly').addClass("disabled_text");
        $("#proj_input_name").text(itemObj.PROJECT_DESC).attr('readonly', 'readonly').addClass("disabled_text");
        $("#equip_input_name").text(itemObj.EQUIP_DESC).attr('readonly', 'readonly').addClass("disabled_text");

        //        $("#item_description").val(itemObj.DESCRIPTION).attr('readonly', 'readonly').addClass("disabled_text");
        $("#description").val(itemObj.CATEGORY_DESC).attr('readonly', 'readonly').addClass("disabled_text");
        $("#comments").val(itemObj.COMMENTS).attr('readonly', 'readonly').addClass("disabled_text");
        //       $("#croptype").text(itemObj.CROP_TYPE).attr('readonly', 'readonly').addClass("disabled_text");
        //       $("#companyname").text(itemObj.COMPANY).attr('readonly', 'readonly').addClass("disabled_text");
        $("#account_details").text(itemObj.DEPT +'-'+itemObj.ACTIVITY +'-'+itemObj.ACCOUNT+'-'+itemObj.PROJECT +'-'+itemObj.EQUIP_CLASS).attr('disabled', true).addClass("disabled_text");
    }
    else
    {
        $("#error_state_msg_line").hide();
        if (status_st == "ERROR" && itemObj.ERROR_MESSAGE != undefined){
            var err = (itemObj.ERROR_MESSAGE == undefined)?"-":itemObj.ERROR_MESSAGE;
            $("#error_state_msg_line").html( '*<b>Error</b>: '+err);
            $("#error_state_msg_line").show();
            
        }
        //        alert(itemObj.CROP_YEAR);
        comp_quantity=itemObj.QUANTITY;
        comp_rate=itemObj.RATE;
        comp_description=itemObj.CATEGORY_DESC;
        comp_comments=(itemObj.COMMENTS==undefined)?"":itemObj.COMMENTS;
        comp_department=itemObj.DEPT;
        comp_activity=itemObj.ACTIVITY;
        comp_project=itemObj.PROJECT;
        comp_equipment=itemObj.EQUIP_CLASS;
        //        $("#item_description").val(itemObj.DESCRIPTION);
        $("#quantity").val(comp_quantity);
        $("#rate").val((comp_rate*1.00).toFixed(4));
        $("#amount").text((itemObj.AMOUNT*1.00).toFixed(4));
        $("#dept_input_id").text(comp_department);
        $("#act_input_id").text(comp_activity);
        $("#proj_input_id").text(comp_project);
        $("#equ_input_id").text(comp_equipment);
        $("#account_account").text( itemObj.ACCOUNT);
        
        $("#dept_input_name").text(itemObj.DEPARTMENT_DESC);
        $("#act_input_name").text(itemObj.ACTIVITY_DESC);
        $("#acc_input_name").text( itemObj.ACCOUNT_DESC);
        $("#proj_input_name").text(itemObj.PROJECT_DESC);
        $("#equip_input_name").text(itemObj.EQUIP_DESC);
        
        try{
            $("#description").val(decodeURIComponent(comp_description).replace(/\"/g, '"'));
        }catch(e){
            $("#description").val(comp_description);
        }
        
        try{
            $("#comments").val(decodeURIComponent(comp_comments).replace(/\"/g, '"'));
        }catch(e){
            $("#comments").val(comp_comments);
        }
        //       $("#croptype").text(itemObj.CROP_TYPE);
        //       $("#companyname").text(itemObj.COMPANY);
        
        $("#account_details").text(itemObj.DEPT +'-'+itemObj.ACTIVITY +'-'+itemObj.ACCOUNT+'-'+itemObj.PROJECT +'-'+itemObj.EQUIP_CLASS);
    }
                                                                         
    $("#line_attachment_list").html("");
    for (var j = 0; j < itemObj.lineattachments.length; j++)
    {
        var attachdata = itemObj.lineattachments[j];
        $("#line_attachment_list").append("<li>"+attachdata.IMAGENAME+"</li>");
    }
    $('#line_attachment_list').listview('refresh');
                                                                         
    hide();
    $("#listitems_addnew_list").show();
}
function setAccountValues(dept,act,acc,proj,equip,dDesc,actDesc,acDesc,pDesc,eDesc){
    $("#dept_input_id").text(dept);
    $("#act_input_id").text(act);
    $("#account_account").text(acc); 
    $("#proj_input_id").text(proj); 
    $("#equ_input_id").text(equip); 
    
    $("#dept_input_name").text((dDesc==undefined)?"-":dDesc);
    $("#act_input_name").text((actDesc==undefined)?"-":actDesc);
    $("#acc_input_name").text((acDesc==undefined)?"-":acDesc);
    $("#proj_input_name").text((pDesc==undefined)?"-":pDesc);
    $("#equip_input_name").text((eDesc==undefined)?"-":eDesc);
    
    $("#account_details").text($("#dept_input_id").text()+'-'+$("#act_input_id").text()+'-'+$("#account_account").text()+'-'+$("#proj_input_id").text()+'-'+$("#equ_input_id").text());
}
function setAccessibility(dp,act,acc,pr,eq){
    (dp=="Y")?$("#comments_department").addClass("accounts_arrow"):$("#comments_department").removeClass("accounts_arrow");
    (act=="Y")?$("#comments_activity").addClass("accounts_arrow"):$("#comments_activity").removeClass("accounts_arrow");
    (acc=="Y")?$("#comments_account").addClass("accounts_arrow"):$("#comments_account").removeClass("accounts_arrow");
    (pr=="Y")?$("#comments_project").addClass("accounts_arrow"):$("#comments_project").removeClass("accounts_arrow");
    (eq=="Y")?$("#comments_eqipment").addClass("accounts_arrow"):$("#comments_eqipment").removeClass("accounts_arrow");
}
function requestAccFromCategory(selectedCategory,callback){
    var params = '{"category":"'+selectedCategory+'","requestor":"'+req_id+'"}';
    var url = baseURL + 'GetAccountsFromCategory';
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'jsonp',
        data: 'body='+params,
        timeout: 30000,
        async: false,
        success: function(data, textStatus, xhr)
        {
            var response = JSON.parse(data);
            
            if(response.response == "SUCCESS"){
                callback(response);
            }else{
                $("#loading_screen").hide();
                $("#listitems_addnew_list").show();
            }
        },
        error: function(request, status, error)
        {
            $("#loading_screen").hide();
            $("#listitems_addnew_list").show();
        }

    });
}

function hide()//for hiding of multiple pages
{
    $("#listitems_div").hide();
    $("#listitems_addnew_list").hide();
    $("#listitems_accounts").hide();
    $("#listitems_requister").hide();
    $("#listitems_comments_department").hide();
    $("#listitems_comments_activity").hide();
    $("#listitems_accounts_project").hide();
    $("#listitems_accounts_equipment").hide();
    $("#listitems_accounts_account").hide();
    $(window).scrollTop(0);
}
function departmentSelected(dept_id,desc)//when click on Department depends on index the values replaced in company and croptype
{
    itemObj2.DEPT = dept_id;
    $("#dept_input_id").text(dept_id);
    $("#dept_input_name").text(desc);
    hide();
    $("#listitems_accounts").show();
}

function activitySelected(act,desc)//when click on Activity search the click values replaced
{
    itemObj2.ACTIVITY = act;
    $("#act_input_id").text(act);
    $("#act_input_name").text(desc);
    hide();
    $("#listitems_accounts").show();
//alert(itemObj2.ACTIVITY);
}
function projectSelected(pro,desc)//when click on Project search the click values replaced
{
    //    alert(pro);
    itemObj2.PROJECT = pro;
    $("#proj_input_id").text(pro);
    $("#proj_input_name").text(desc);
    hide();
    $("#listitems_accounts").show();
//alert(itemObj2.PROJECT);
}
function equipmentSelected(equ,desc)//when click on Equipment search the click values replaced
{
    itemObj2.EQUIP_CLASS = equ;

    $("#equ_input_id").text(equ);
    $("#equip_input_name").text(desc);
    hide();
    $("#listitems_accounts").show();
//alert( itemObj2.EQUIP_CLASS);
}
function accountSelected(acc,desc)//when click on Equipment search the click values replaced
{
    itemObj2.ACCOUNT = acc;
    $("#account_account").text(acc);
    $("#acc_input_name").text(desc);
    hide();
    $("#listitems_accounts").show();
//alert( itemObj2.EQUIP_CLASS);
}
function requisterid(reqid,reqname)//when click Requestor search the click values replaced
{
    //alert(v);
    req_id = reqid;
    $("#req_input_id").text(reqid);
    $("#req_input_name").text(reqname);
    hide();
    $("#listitems_div").show();

    for (var i = 0; i < responseData.data.length; i++)
    {
        var resdata = responseData.data[i];
        resdata.REQUESTOR_ID = req_id;
        resdata.FULL_NAME = $("#req_input_name").text();
        responseData.data[i] = resdata;
    }
    var url = baseURL + 'GetUserDetails';
    var params = '{"requestor_id":"' + req_id + '"}';
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'jsonp',
        data: 'body=' + params,
        timeout: 30000,
        async: false,
        success: function(data, textStatus, xhr)
        {
            var response = JSON.parse(data);

            if (response.response == 'success')
            {
                var resdata = response.data;
                department = resdata.DEPT;
                activity = resdata.ACTIVITY;
                project = resdata.PROJECT;
                catDept = resdata.DEPT;
                catAccount = resdata.ACCOUNT;
                catActivity = resdata.ACTIVITY;
            }
        },
        error: function(request, status, error)
        {
            hide();
            $("#loading_screen").hide();
            //                alert(error);
            $("#error_msg").text(error);
            $("#canceldialog").popup('open');
            $('#alert_ok').click(function()
            {
                $("#canceldialog").popup('close');
            });
            $("#listitems_div").show();
        }
    }); 


}
// Validation for numeric values
function isNumberKey(evt)//for number field in Unit Price and Quantity
{
    var charCode = (evt.which) ? evt.which : evt.keyCode

    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode!=46)
        return false;
    return true;
}
function reDefaultAccounts(){
    $("#dept_input_id").text(catDept);
    $("#act_input_id").text(catActivity);
    $("#account_account").text(catAccount); 
    $("#proj_input_id").text(catProject); 
    $("#equ_input_id").text(catEquip); 

    $("#dept_input_name").text(catDeptDesc);
    $("#act_input_name").text(catActivityDesc);
    $("#acc_input_name").text(catAccountDesc); 
    $("#proj_input_name").text(catProjectDesc); 
    $("#equip_input_name").text(catEquipDesc); 
    
    $("#account_details").text($("#dept_input_id").text()+'-'+$("#act_input_id").text()+'-'+$("#account_account").text()+'-'+$("#proj_input_id").text()+'-'+$("#equ_input_id").text());
}
//Delete action to delete a line from requisition
function deleteLineConfirm(){
    $("#delete_confirm_msg").text("Do you really want to delete this line");
    $("#delete_dialog").popup('open'); 
}

function deleteLine(){
    hide();
    
    var currentLine = responseData.data[selectedItem];
    //    alert(currentLine.TRX_LINE_ID);
    if(currentLine.TRX_LINE_ID != 0){
        $("#loading_screen").show();
        var url = baseURL + 'DeleteLine';
        var params = '{"TRX_ID":"' + currentLine.TRX_ID + '","TRX_LINE_ID":"' + currentLine.TRX_LINE_ID + '"}';
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'jsonp',
            data: 'body=' + params,
            timeout: 30000,
            async: false,
            success: function(data, textStatus, xhr)
            {
                var response = JSON.parse(data);
                $("#loading_screen").hide();
                if (response.response == 'success')
                {
                    $("#error_msg").text(response.data.status);
                    $("#canceldialog").popup('open');
                    $('#alert_ok').click(function()
                    {
                        $("#canceldialog").popup('close');
                        //     document.location = "listitems.html";
                        location.reload();
                    });
                }else{
                    $("#error_msg").text(response.data.status);
                    $("#canceldialog").popup('open');
                    $('#alert_ok').click(function()
                    {
                        $("#canceldialog").popup('close');
                        //    document.location = "listitems.html";
                        location.reload();
                    });
                }
            },
            error: function(request, status, error)
            {
                hide();
                $("#loading_screen").hide();
                //               alert(error);
                $("#error_msg").text(error);
                $("#canceldialog").popup('open');
                $('#alert_ok').click(function()
                {
                    $("#canceldialog").popup('close');
                });
                $("#listitems_div").show();
            }
        });
    }else{
        responseData.data.splice(selectedItem,1);
        hide();
        $("#listitems_div").show();
        loadData();
    }
}
function escape (val) {
    if (typeof(val)!="string") return val;
    return val
    .replace(/[\\]/g, '\\\\')
    .replace(/[\/]/g, '\\/')
    .replace(/[\b]/g, '\\b')
    .replace(/[\f]/g, '\\f')
    .replace(/[\n]/g, '\\n')
    .replace(/[\r]/g, '\\r')
    .replace(/[\t]/g, '\\t')
    .replace(/[\"]/g, '\\"')
    .replace(/\\'/g, "\\'");
}
