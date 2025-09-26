jQuery(function( $ ){

	$(".home .nav-header .genesis-nav-menu").addClass("responsive-menu").before('<div id="responsive-menu-icon"></div>');

	$(function() {
	    //caches a jQuery object containing the header element
	    $(window).scroll(function() {
	        var scroll = $(window).scrollTop();
			if ( $(window).innerWidth() > 768) {
				if (scroll >= 20) {
					$("body").addClass("body-scroll");
				} else {
					$("body").removeClass("body-scroll");
				}
			}
	    });
	});

	$(".newsletter-name").attr("placeholder", "First Name");
	$(".newsletter-email").attr("placeholder", "Email Address");
});