$(function () {
    $('#datetimepicker1').datetimepicker();
});

function getDetialTrip(id) {
    let data = {id:id};
    $.ajax({
        type:'POST',
        url:'/index/page',
        data:data
    }).done(function (data) {
        $("#indexProduct").load(window.location.href +  ' #indexProduct');
        $("#listPageIndex").load(window.location.href +  ' #listPageIndex');
    }).fail(function (data) {
        $("#indexProduct").load(window.location.href +  ' #indexProduct');
        $("#listPageIndex").load(window.location.href +  ' #listPageIndex');
});
}