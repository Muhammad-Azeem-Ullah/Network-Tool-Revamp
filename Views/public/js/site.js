$(document).ready(function () {
    $('#dataTables-example').DataTable({
        responsive: true
    });
});
$("#tablebody").on('click', 'td', function () {
    let ip = $(event.target).parent('tr').children('.ipAddress').html(); 
    window.location.href = "user?ip=" + ip;
});

$("#tablebody").on('click', '#btnClear', function () {
    alert($(event.target).attr("data-userId"));
    return false;
});