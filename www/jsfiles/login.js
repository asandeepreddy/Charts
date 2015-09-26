$(document).ready(function(){
    clearStorage();
    $("#loading_screen").hide();
    
    // Remember me logic
    $("input[type='radio']:checked").each(function() {
        $(this).attr('checked', false).checkboxradio("refresh");
    });
    $("input:radio[value=" + localStorage.rememberme + "]").attr('checked', true).checkboxradio("refresh");
        
    if(localStorage.rememberme == '1'){ // Pre-entering credentails
        var logindetails = localStorage.remembermedetails;
        var rem_obj = JSON.parse(logindetails);
        $("#username").val(rem_obj.username);
        $("#password").val(rem_obj.password);
    }
        
    // Tracking enter key press
    $('input').on('keyup', function(e) {    
        if (e.which == 13) {
            $('input').blur();
            formPayload();
        }
    });
    
    
    // Login Functionality i.e Making requests and handling response
    $('#login').click(function()
    {
        formPayload();
    });
    function formPayload(){
        var uname = $("#username").val().replace(/\s/g, '');// replaces all spaces in text
        var passwd = $("#password").val().replace(/\s/g, '');

        if ((uname.length && passwd.length))
        {
            $("#loginform_div").hide();
            $("#loading_screen").show();
            // JSON FORMAT USED {"username": user name, "password": password}
            var params = '{\"username\":\"' + uname + '\",\"password\":\"' + passwd + '\"}';
                
            localStorage.rememberme = $("input[type='radio']:checked").val();
            if(localStorage.rememberme=="1"){
                localStorage.remembermedetails = params;
            }else{
                localStorage.remembermedetails = "";
            }
                
            login(params);
        }
        else// either username or password or both not entered
        {
            $("#loginform_div").show();
            $("#error_msg").text("Invalid Credentials");
            $("#canceldialog").popup('open');

        }
    }
    function login(params) {
        var url = baseURL + 'Login';
        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'jsonp',
            data: 'body=' + params,
            timeout: 30000,
            success: function(data, textStatus, xhr) {
                var response = JSON.parse(data);
                if (response.response == 'success')
                {
                    var resdata = response.data;
                    localStorage.requesterid = resdata.PERSON_ID;
                    localStorage.creatorid = resdata.PERSON_ID;
                    localStorage.dept = resdata.DEPT;
                    localStorage.activity = resdata.ACTIVITY;
                    localStorage.project = resdata.PROJECT;
                    localStorage.account = resdata.ACCOUNT;
                    localStorage.equip = resdata.EQUIP;
                    localStorage.deptDesc = resdata.DEPARTMENT_DESC;
                    localStorage.actDesc = resdata.ACTIVITY_DESC;
                    localStorage.accDesc = resdata.ACCOUNT_DESC; 
                    localStorage.projDesc = resdata.PROJECT_DESC; 
                    localStorage.equipDesc = resdata.EQUIP_DESC;
                    
                    localStorage.requestorname = resdata.FULL_NAME_CREATOR;
                    localStorage.orgId = response.warehouse.ORGANIZATION_ID;
                    document.location = "requisitionlist.html";
                }
                else
                {
                    $("#loading_screen").hide();
                    $("#loginform_div").show();
                    $("#error_msg").text(response.data.status);
                    $("#canceldialog").popup('open');
                }
            },
            //When timesout passess error and displays alert
            error: function(request, status, error) {
                $("#loading_screen").hide();
                $("#loginform_div").show();
                $("#error_msg").text(error);
                $("#canceldialog").popup('open');
            }
        });
    }
});
    
    
function clearStorage(){ // removing unneccessory data from localstrorage
    localStorage.removeItem("filters");
    localStorage.removeItem("requesterid");
    localStorage.removeItem("creatorid");
    localStorage.removeItem("dept");
    localStorage.removeItem("activity");
    localStorage.removeItem("project");
    localStorage.removeItem("account");
    localStorage.removeItem("requestorname");
    localStorage.removeItem("orgId");
}