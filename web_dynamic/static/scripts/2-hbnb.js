$(function () {
  const amedict = {};
  $('.popover li input').change(function () {
    const id = $(this).attr('data-id');
    const name = $(this).attr('data-name');
    if (this.checked) {
      amedict[id] = name;
    } else {
      delete amedict[id];
    }
    $('.amenities h4').text(Object.values(amedict).join(', '));
  });
  const urlstatus = 'http://localhost:5001/api/v1/status/';
  $.get(urlstatus, function (response) {
    if (response.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });
});
