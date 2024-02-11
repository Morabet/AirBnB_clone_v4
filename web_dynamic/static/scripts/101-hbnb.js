// untill the window and DOM is ready
$(function () {
  /* Get all places */
  placesFilters();

  /* get the status of the connection */
  $.get('http://0.0.0.0:5001/api/v1/status/', function (response) {
    if (response.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });

  const states = {};
  const cities = {};
  const amenities = {};

  /** **** States *********/
  /* go through all the checkbox if they are already checked, uncheck them */
  $('.locations .popover ul li h2 input').each(function () {
    if (this.checked) {
      this.checked = false;
    }
  });

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
  /* go through all the checkbox if they are already checked, uncheck them */
  $('.locations .popover ul li ul li input').each(function () {
    if (this.checked) {
      this.checked = false;
    }
  });

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

  /** **** Amenities *********/
  /* go through all the checkbox if they are already checked, uncheck them */
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

  /** **** Button Search *********/
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
  const divReviews = $('<div>').addClass('reviews');

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

  /* Reviews */
  const reviewTitle = $('<h2>').text(('Reviews'));
  const span = $('<span>').text('show');
  span.on('click', function () {
    if (span.text() === 'show') {
      getReviews(divReviews, place.id);
      span.text('hide');
    } else {
      $('.reviews ul').remove();
      span.text('show');
    }
  });
  reviewTitle.append(span);
  divReviews.append(reviewTitle);

  /* add children */
  article.append(divTitle);
  article.append(divInfo);
  article.append(divDesc);
  article.append(divReviews);

  $('.places').append(article);
}

/* get reviews for place */
function getReviews (divReviews, placeId) {
  $.ajax({
    url: `http://0.0.0.0:5001/api/v1/places/${placeId}/reviews`,
    type: 'GET',
    success: function (response) {
      createReview(divReviews, response);
    }
  });
}
/* create Reviews for place */
function createReview (divReviews, placeReviews) {
  const ul = $('<ul>');

  placeReviews.forEach(review => {
    const userInfo = $('<h3>');
    /* get user */
    $.get(`http://0.0.0.0:5001/api/v1//users/${review.user_id}`, (user) => {
      userInfo.text(`From ${user.first_name} ${user.last_name} the ${formatDate(review.updated_at)}`);
    });

    const pr = $('<p>').html(review.text);
    ul.append($('<li>').append(userInfo, pr));
  });

  divReviews.append(ul);
}

/* format review date */
function formatDate (reviewIsoDate) {
  const reviewDate = new Date(reviewIsoDate);
  // Get day, month, and year from the reviewDate
  const day = reviewDate.getDate();
  const monthIndex = reviewDate.getMonth() + 1;
  const year = reviewDate.getFullYear();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'
  ];

  // Get the suffix for the day (e.g., "st", "nd", "rd", "th")
  const daySuffix = (day >= 11 && day <= 13) ? 'th' : ['th', 'st', 'nd', 'rd'][day % 10] || 'th';

  // Construct the formatted date string
  const formattedDate = day + daySuffix + ' ' + monthNames[monthIndex] + ' ' + year;

  return (formattedDate);
}
