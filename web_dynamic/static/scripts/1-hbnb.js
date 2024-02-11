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
});
