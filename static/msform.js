//jQuery time
var current_fs, next_fs, previous_fs; //fieldsets
var left, opacity, scale; //fieldset properties which we will animate
var animating; //flag to prevent quick multi-click glitches

$(".next").click(function(){	
	current_fs = $(this).parent();
	next_fs = $(this).parent().next();

	if(animating) return false;
	animating = true;
	//activate next step on progressbar using the index of next_fs
	$("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
	
	//show the next fieldset
	next_fs.show(); 
	//hide the current fieldset with style
	current_fs.animate({opacity: 0}, {
		step: function(now, mx) {
			//as the opacity of current_fs reduces to 0 - stored in "now"
			//1. scale current_fs down to 80%
			scale = 1 - (1 - now) * 0.2;
			//2. bring next_fs from the right(50%)
			left = (now * 50)+"%";
			//3. increase opacity of next_fs to 1 as it moves in
			opacity = 1 - now;
			current_fs.css({'transform': 'scale('+scale+')'});
			next_fs.css({'left': left, 'opacity': opacity});
		}, 
		duration: 800, 
		complete: function(){
			current_fs.hide();
			animating = false;
		}, 
		//this comes from the custom easing plugin
		easing: 'easeInOutBack'
	});
	
});

$(".previous").click(function(){
	if(animating) return false;
	animating = true;
	
	current_fs = $(this).parent();
	previous_fs = $(this).parent().prev();
	
	//de-activate current step on progressbar
	$("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
	
	//show the previous fieldset
	previous_fs.show(); 
	//hide the current fieldset with style
	current_fs.animate({opacity: 0}, {
		step: function(now, mx) {
			//as the opacity of current_fs reduces to 0 - stored in "now"
			//1. scale previous_fs from 80% to 100%
			scale = 0.8 + (1 - now) * 0.2;
			//2. take current_fs to the right(50%) - from 0%
			left = ((1-now) * 50)+"%";
			//3. increase opacity of previous_fs to 1 as it moves in
			opacity = 1 - now;
			current_fs.css({'left': left});
			previous_fs.css({'transform': 'scale('+scale+')', 'opacity': opacity});
		}, 
		duration: 800, 
		complete: function(){
			current_fs.hide();
			animating = false;
		}, 
		//this comes from the custom easing plugin
		easing: 'easeInOutBack'
	});
});

$(".submit").click(function(){
	var json = {}
	json.name = $("input[name='name']").val();
	json.email = $("input[name='email'").val();
	json.school = $("input[name='school'").val();
	json.cell_number = $("input[name='cell_number'").val();
	json.best = $("input[name='best']").val();
	json.allergies = $("input[name='allergies']").val();
	json.snack = $("input[name='snack']").val();
	json.drink = $("input[name='drink']").val();
	json.shirt_size = $("#shirt_size").val();
	json.vegetarian = $("#vegetarian").prop('checked');
	json.vegan = $("#vegan").prop('checked');
	json.kosher = $("#kosher").prop('checked');
	json.halal = $("#halal").prop('checked');
	json.lactose = $("#lactose").prop('checked');
	json.survey = $(".bool-slider").hasClass("true");
	json.survey_now = $("#survey").prop('checked');
	$.post("/create_signup",json,function(data){
		//window.location.href="/";
	});
	return false;
});

$(document).ready(function() {
    $('.bool-slider .inset .control').click(function() {
        if (!$(this).parent().parent().hasClass('disabled')) {
            if ($(this).parent().parent().hasClass('true')) {
                $(this).parent().parent().addClass('false').removeClass('true');
            } else {
                $(this).parent().parent().addClass('true').removeClass('false');
            }
        }
    });
});