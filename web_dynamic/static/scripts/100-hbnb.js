// untill the window and DOM is ready
$(function () {
  /* Get all places */
  placesFilters();

  const amenities = {};

  /* if checkboxs are already checked uncheck them */
  $('.amenities .popover li input').each(function () {
    if (this.checked) {
      this.checked = false;
    }
  });

  /* listen to changes of the checkbox */
  $('.amenities .popover li input').change(function () {
    if (this.checked) {
      amenities[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete amenities[$(this).attr('data-id')];
    }

    $('.filters .amenities h4').text(Object.values(amenities).join(', '));
  });

  $.get('http://0.0.0.0:5001/api/v1/status/', function (response) {
    if (response.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });

  /** **** States *********/
  const states = {};
  const cities = {};

  /* let's go through all the checkbox of states if they are already checked add them to the list */
  $('.locations .popover ul li h2 input').each(function () {
    if (this.checked) {
      states[$(this).attr('data-id')] = $(this).attr('data-name');
    }
  });
  if (states) {
    $('.filters .locations h4').text(Object.values(states).join(', '));
  }

  /* listen to changes of the checkbox */
  $('.locations .popover ul li h2 input').change(function () {
    if (this.checked) {
      states[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete states[$(this).attr('data-id')];
    }

    $('.filters .locations h4').text(Object.values(states).join(', '));
    /* if there are no states checked but cities are display them */
    if (Object.keys(states).length === 0 && Object.keys(cities).length !== 0) {
      $('.filters .locations h4').text(Object.values(cities).join(', '));
    }
  });

  /** **** Cities *********/

  /* let's go through all the checkbox of cities if they are already checked add them to the list */
  $('.locations .popover ul li ul li input').each(function () {
    if (this.checked) {
      cities[$(this).attr('data-id')] = $(this).attr('data-name');
    }
  });
  if (cities && Object.keys(states).length === 0) {
    $('.filters .locations h4').text(Object.values(cities).join(', '));
  }

  /* listen to changes of the checkbox */
  $('.locations .popover ul li ul li input').change(function () {
    if (this.checked) {
      cities[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete cities[$(this).attr('data-id')];
    }

    if (Object.keys(states).length === 0) {
      $('.filters .locations h4').text(Object.values(cities).join(', '));
    }
  });

  /* Get places based on states, citise, amenities filter when button clicked */
  $('button').on('click', function () {
    /* remove all children from places first */
    $('.places').empty();

    placesFilters({
      states: Object.keys(states),
      cities: Object.keys(cities),
      amenities: Object.keys(amenities)
    });
  });
});

/* make a request to get the places based on amenities */
function placesFilters (filterSearch = {}) {
  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/places_search/',
    type: 'POST',
    contentType: 'application/json', // Specify content type as JSON
    data: JSON.stringify(filterSearch), // Send an empty JSON object as the data
    success: function (response) {
      response.forEach(place => createPlace(place));
    }
  });
}

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
