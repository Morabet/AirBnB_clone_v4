// untill the window and DOM is ready
$(function () {
  const amenities = {};

  /* if the checkbox are already checked and uncheck them */
  $('.popover li input').each(function () {
    if (this.checked) {
      this.checked = false;
    }
  });

  /* listen to changes of the checkbox */
  $('.popover li input').change(function () {
    if (this.checked) {
      amenities[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete amenities[$(this).attr('data-id')];
    }

    $('.filters .amenities h4').text(Object.values(amenities).join(', '));
  });

  $.get('http://localhost:5001/api/v1/status/', function (response) {
    console.log(response.status);
    if (response.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });

  $.ajax({
    url: 'http://localhost:5001/api/v1/places_search/',
    type: 'POST',
    contentType: 'application/json', // Specify content type as JSON
    data: JSON.stringify({}), // Send an empty JSON object as the data
    success: function (response) {
      response.forEach(place => createPlace(place));
    }
  });
});

/* a function to create a place article */
function createPlace (place) {
  const article = $('<article>');
  const divTitle = $('<div>').addClass('title_box');
  const divInfo = $('<div>').addClass('information');
  const divDesc = $('<div>').addClass('description');

  /* title */
  const placeName = $('<h2>');
  placeName.text(place.name);

  const priceNight = $('<div>');
  priceNight.addClass('price_by_night');
  priceNight.text(`$${place.price_by_night}`);
  divTitle.append(placeName, priceNight);

  /* info */
  const maxGuest = $('<div>');
  maxGuest.addClass('max_guest');
  maxGuest.text(`${place.max_guest} Guest${place.max_guest === 1 ? '' : 's'}`);
  divInfo.append(maxGuest);

  const numberRooms = $('<div>');
  numberRooms.addClass('number_rooms');
  numberRooms.text(`${place.number_rooms} Bedroom${place.number_rooms === 1 ? '' : 's'}`);
  divInfo.append(numberRooms);

  const numberBathrooms = $('<div>');
  numberBathrooms.addClass('number_bathrooms');
  numberBathrooms.text(`${place.number_bathrooms} Bathroom${place.number_bathrooms === 1 ? '' : 's'}`);
  divInfo.append(numberBathrooms);

  /* description */
  divDesc.html(place.description);

  article.append(divTitle);
  article.append(divInfo);
  article.append(divDesc);

  $('.places').append(article);
}
