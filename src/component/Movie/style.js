import $ from 'jquery'; 
// Demo 11 Js file
$(document).ready(function () {

    // Filter toggle
    $('.filter-toggler').on('click', function (e) {
    	$(this).toggleClass('active');
    	$('.product-filter').fadeToggle('fast');
    	$('.widget-filter-area').slideToggle('500');
    	e.preventDefault();
    });

    // Clear All checkbox/remove filters in filter area
    $('.widget-filter-clear').on('click', function (e) {
    	$('.widget-filter-area').find('input[type=checkbox]').prop('checked', false);
    	e.preventDefault();
    });

    // var $cinemadepth3 = $('#ulMovieList li');
    // $cinemadepth3
    // .mouseover(function () {
    //     $(this).addClass('hover')
    // })
    // .mouseout(function () {
    //     $(this).removeClass('hover')
    // })

});