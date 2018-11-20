//Script for SignUp page
function toggleAccount (){
    if($("#typeOfAccount").val() === "customer")
    {
        $("#agencyName").hide();
        $("#agencyAdress").hide();
        $("#agencyPhoneNumber").hide();
        $("#agencyDiscription").hide();
        $("[name='agencyName']").attr('required',false);
        $("[name='agencyAdress']").attr('required',false);
        $("[name='agencyPhoneNumber']").attr('required',false);
        $("[name='agencyDiscription']").attr('required',false);
    }
    else{
        $("#agencyName").show();
        $("#agencyAdress").show();
        $("#agencyPhoneNumber").show();
        $("#agencyDiscription").show();
        $("[name='agencyName']").attr('required',true);
        $("[name='agencyAdress']").attr('required',true);
        $("[name='agencyPhoneNumber']").attr('required',true);
        $("[name='agencyDiscription']").attr('required',true);
    }
}
