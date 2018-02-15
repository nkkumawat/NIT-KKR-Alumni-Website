
$(document).ready(function() {
	initMenu();
	activeMenu();
	$('.lightbox').lightbox();
	accordion();
});

function accordion() {
	
	$('.accordionContent').each(function() {
		var boxHeight = $(this).sandbox(function(){ return this.height(); });
		boxHeight = boxHeight + 20;
		$(this).css('height',boxHeight);
	});
	
	$('.toggler').click(
		function() {
			$('.accordionContent').slideUp('normal');
			$(this).next().slideToggle('normal');
		}
	);	
}

$.fn.sandbox = function(fn) {
    var element = $(this).clone(), result;
    // make the element take space in the page but invisible
    element.css({visibility: 'hidden', display: 'block'}).insertAfter(this);
    // to override any display: none !important you may have been using
    element.attr('style', element.attr('style').replace('block', 'block !important'));
    result = fn.apply(element);
    element.remove();
    return result;
};

/* ACCORDION FUNCTIONALITY */
function initMenu() {
	$('.subMenuBox').hide();
	$('.menu li a span').click(
		function() {
			$(this).parent().next().slideToggle('normal');
		}
	);
	var openMenu = $("#openMenu").attr("class");
	$(".menu li div").each( function () {
		if (this.id == openMenu) {
			$(this).show();
		}
	});
}

function activeMenu() {
	var activeTopMenu = $("#topMenu").attr("class");
	var activeSideMenu = $("#sideMenu").attr("class");
	var activeAccordionMenu = $("#sideAccordion").attr("class");				
	$("#menu ul").children().each( function () {
		
		if (this.id == activeTopMenu) {
			$(this).addClass("active");
		}
	}); 
	$("#sideBarMenu .menu").children().each( function () {
		if (this.id == activeSideMenu) {
			$(this).addClass("active");
		}
	});
	$(".accordion").children().each( function () {
		if (this.id == activeAccordionMenu) {
			$(this).children().addClass("current");
		}
	});
}

function changeCompanyForms(company) {
	$('#corporateForms ul').hide();
	$('ul#' + company).show(); 	
}