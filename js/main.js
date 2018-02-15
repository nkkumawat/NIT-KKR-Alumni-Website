
$(document).ready(function() {
	
	$(".chzn-select").chosen();
	$('.lightbox').lightbox();
	/*
	var zIndexNumber = 1000;
	$('div').each(function() {
		$(this).css('zIndex', zIndexNumber);
		zIndexNumber -= 10;
	});
	*/
	var config = {
		 sensitivity: 1, // number = sensitivity threshold (must be 1 or higher)
		 interval: 0, // number = milliseconds for onMouseOver polling interval
		 over: megaHoverOver, // function = onMouseOver callback (REQUIRED)
		 timeout: 0, // number = milliseconds delay before onMouseOut
		 out: megaHoverOut // function = onMouseOut callback (REQUIRED)
	};
	
	$(".menuDropdown li .dropdown").css({'opacity':'0'}); //Fade sub nav to 0 opacity on default
	$(".menuDropdown li").hoverIntent(config); //Trigger Hover intent with custom configurations
	
	currentMenu();

	
	//$(".loginBox").click(function(){
		//$("#panelHolder").slideToggle("fast");
		//$("#loginBg").toggle();
	//}); 

	$(".tweet").tweet({
        join_text: "auto",
        username: "MSUAA",
        avatar_size: 32,
        count: 3,
        auto_join_text_default: "we said,",
        auto_join_text_ed: "we",
        auto_join_text_ing: "we were",
        auto_join_text_reply: "we replied",
        auto_join_text_url: "we were checking out",
        loading_text: "loading tweets..."
      });
	
	$('#widget .widgetButton.twitter').click( function() {
		$('#widgetFacebookWrap').hide();
		$('#widgetSearchWrap').hide();
		$('#widgetTwitterWrap').toggle();
	});
	$('#widget .widgetButton.fbook').click( function() {
		$('#widgetTwitterWrap').hide();
		$('#widgetSearchWrap').hide();
		$('#widgetFacebookWrap').toggle();
	});
	$('#widget .widgetButton.search').click( function() {
		$('#widgetTwitterWrap').hide();
		$('#widgetFacebookWrap').hide();
		$('#widgetSearchWrap').toggle();
	});
	
	$(".bigLoginPass").live("keydown", function(e) {
		if(e.keyCode == 13) {
			e.preventDefault();
			$('#loginBoxBig .btn').click();
		}
	});
	
	$(".footerMod").equalHeights();
	$(".fromtModules").equalHeights();
	$(".benefitsBox").equalHeights();
	
	

$("#gaMagnifier").click(function(e){
	e.preventDefault();
	grandSearch();
});

	$("#gaSearch").keyup(function(){
	//alert($("#gaSearch").val());
var delayTimer;
 clearTimeout(delayTimer);
    delayTimer = setTimeout(function() {
	grandSearch();
	
	 }, 1000); // Will do the ajax stuff after 1000 ms, or 1 s
});//end search
function grandSearch() {
var delayTimer;
 //clearTimeout(delayTimer);
    //delayTimer = setTimeout(function() {
		
		params = {
		searchTerm: $("#gaSearch").val()
	}
	
	$.ajax({
		url: "searchAwards.cfm",
		type: "POST",
		data: params,
		success: function(results){;
			//$("#rTable").slideUp('slow', function() {
			$("#rTable").html(results);
			$("#switchNumbers").html("")
			$(".story").quickpaginate({ perpage: 20, pager : $("#switchNumbers") });
			//$("#rTable").slideDown('slow', function() {
				
			//});
			//});
		},
		complete: function(){
		}
	});
	
	// }, 1000); // Will do the ajax stuff after 1000 ms, or 1 s
}//end search



});


function memberLogin(basePath, salt1, salt2) {
	if 	($('#username').val() == "" || 
		$('#password').val() == ""){
			
			$('#loginBoxBig').append("<div class='notice alert'><p><strong>Required: </strong>Please fill out all required fields</p></div>");
			$(".alert").fadeOut(5000);
				return;	
	}
	
	$('#notice').empty();
		
	// salt password
	var password = $('#password').val();
    var chars = 'yz0123:?NOPQ/.qVWX,FGS4Ao2134pYZabcdrmsafdn23:?NOPstDE()_uvBC><;56789|}eH#$%^&*vknzQW#$!987-*+{\][TUIJKLM+-=xRfghw!@ijklmn23:?NOPQ/.qVWX,FGS';
    var mixedChars = '';
    
    for (var i = 0; i < salt1; i++)
    	mixedChars += chars.charAt(Math.floor(Math.random() * chars.length));
    
    for (var i = 0; i < password.length; i++) {   	
    	mixedChars += password.charAt(i);
    	
    	for (var j = 0; j < Math.abs(salt1 - salt2); j++)
        	mixedChars += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    for (var i = 0; i < salt2; i++)
    	mixedChars += chars.charAt(Math.floor(Math.random() * chars.length));
	
	var params = {
			username: $('#username').val(),
			password: mixedChars,
			isRememberMe: $('#isRememberMe').attr('checked') == true
	};
	
	$('#loginModuleBox').prepend('<div id="componentDisable"></div><div id="wait"></div>');
	$('#componentDisable').fadeTo('fast', 0.6);	
	
	$.AjaxCFC({
		url: basePath + 'account/components/memberLogin.cfc',
		method: 'authenticate',
		data: params,
		unnamedargs: false,
		serialization: 'json',
		debug: false,
		success: function(r) {
			$('#wait').remove();
			$('#componentDisable').remove();
			
			//alert(r.ISAUTHENTICATED);alert(r.ISRENEWTIME);
			
			if (r.ISAUTHENTICATED && !r.ISRENEWTIME) {
				// successful login, server side auth status has been set, refresh page
				window.location = window.location;
			} else if (r.ISAUTHENTICATED && r.ISRENEWTIME) {
				// successful login, user should renew soon before account expires
				$('.jquery-lightbox-button-close').css('display', 'none');
				$('.expirationDate').text('will expire on ' + r.EXPIRATIONDATE);
				$('#loginModuleBox').hide();
				$('#renewBox').show();
			} else if (!r.ISAUTHENTICATED && r.ISRENEWTIME) {
				// account found but expired, user must renew
				$('.jquery-lightbox-button-close').css('display', 'none');
				$('.expirationDate').text('expired on ' + r.EXPIRATIONDATE);
				$('#loginModuleBox').hide();
				$('#renewBox').show();
			} else {
				// account not found, bad username or password
				$.lightbox().shake();
				$('#password').val('');
				//$('#notice').append('<div class="alert"><strong>Warning:</strong> Incorrect username or password.</div>');
			}
		}
	});
}

/* Shows selected elements in the menu
==============================================================================*/
function currentMenu() {
	var currentMainMenu = $("#levelOneMenuCurrent").attr("class");
	var currentMiniMenu = $("#levelTwoMenuCurrent").attr("class");
	var currentSideMenu = $("#levelThreeMenuCurrent").attr("class");
	var currentSideSubMenu = $("#levelFourMenuCurrent").attr("class");
						
	$("#menu a").each( function () {
		if (this.id == currentMainMenu) {
			$(this).addClass("current");
		}
	}); 
	$("#miniMenu a").each( function () {
		if (this.id == currentMiniMenu) {
			$(this).addClass("current");
		}
	});
	$(".modMenu .menu a").each( function () {
		if (this.id == currentSideMenu) {
			$(this).addClass("current");
		}
	});
	$(".accordion a").each( function () {
		if (this.id == currentSideSubMenu) {
			$(this).addClass("current");
		}
	});
}

//On Hover Over
function megaHoverOver(){
	$(this).find(".dropdown").stop().fadeTo('fast', 1).show(); //Find sub and fade it in
	(function($) {
		//Function to calculate total width of all ul's
		jQuery.fn.calcSubWidth = function() {
			rowWidth = 0;
			//Calculate row
			$(this).find("ul").each(function() { //for each ul...
				rowWidth += $(this).width(); //Add each ul's width together
			});
		};
	})(jQuery); 

	$(this).calcSubWidth();  //Call function to calculate width of all ul's
	$(this).find(".dropdown").css({'width' : rowWidth}); //Set Width

}
//On Hover Out
function megaHoverOut(){
  $(this).find(".dropdown").stop().fadeTo('fast', 0, function() { //Fade to 0 opactiy
	  $(this).hide();  //after fading, hide it
  });
}

// Equal Hights Plugin
(function($) {
	$.fn.equalHeights = function(minHeight, maxHeight) {
		tallest = (minHeight) ? minHeight : 0;
		this.each(function() {
			if($(this).height() > tallest) {
				tallest = $(this).height();
			}
		});
		if((maxHeight) && tallest > maxHeight) tallest = maxHeight;
		return this.each(function() {
			$(this).height(tallest);
		});
	};

if(!uadvWebTeam){var uadvWebTeam={}}uadvWebTeam.CAPITAL_LETTERS=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","R","X","Y","Z"];uadvWebTeam.LOWER_CASE_LETTERS=["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];uadvWebTeam.NUMBERS=["1","2","3","4","5","6","7","8","9","0"];$(function(){$(".limited_number, .limited_lower_alpha, .limited_upper_alpha, .limited_special, .limited_none").bind("input paste",function(a){var b=$(this);var c=b.val();var d=new Array;var e=false;var f=false;var g=false;var h=false;var i=false;if(b.hasClass("limited_none")){e=true}if(!e){if(b.hasClass("limited_number")){d=d.concat(uadvWebTeam.NUMBERS);f=true}if(b.hasClass("limited_lower_alpha")){d=d.concat(uadvWebTeam.LOWER_CASE_LETTERS);g=true}if(b.hasClass("limited_upper_alpha")){d=d.concat(uadvWebTeam.CAPITAL_LETTERS);h=true}if(b.attr("data-allowed")){var j=",";if(b.data("delineator")){j=b.data("delineator")}d=d.concat(b.attr("data-allowed").split(j));i=true}for(var k=0;k<c.length;k++){var l=false;for(var m=0;m<d.length;m++){if(c[k]==d[m]){l=true;break}}if(!l){var n=c[k];if(g&&!h){if(k==0){c=c.substr(k+1)+String.fromCharCode(n.charCodeAt(0)+32)}else if(k>0){c=c.substr(0,k)+String.fromCharCode(n.charCodeAt(0)+32)+c.substr(k+1)}}else if(h&&!g){if(k==0){c=c.substr(k+1)+String.fromCharCode(n.charCodeAt(0)-32)}else if(k>0){c=c.substr(0,k)+String.fromCharCode(n.charCodeAt(0)-32)+c.substr(k+1)}}else{if(k==0){c=c.substr(k+1)}else if(k>0){c=c.substr(0,k)+c.substr(k+1)}}}}b.val(c)}if(b.attr("data-capCount")&&b.attr("maxlength")>0){$(this).next(".capCount").html(b.attr("maxlength")-c.length+" left")}})})

})(jQuery);
