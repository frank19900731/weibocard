/*
  UI Styles: Menu Groups
*/
function menuGroup(){
  $('html').click(function() {
    if ($(".menu-trigger").hasClass("active")){
      $(".menu-trigger").removeClass("active");
    }
    if ($(".menu-dropdown").hasClass("open")){
      $(".menu-dropdown").removeClass("open").addClass("closed");
    }
  });
  // Open menu
  $(".menu-trigger").click(function(event) {
    event.preventDefault();
    event.stopPropagation();
    $(this).toggleClass("active");
    if($(this).next('.menu-dropdown').hasClass("closed")){
      $(this).next(".menu-dropdown").removeClass("closed").addClass("open");
    }
    $("input[name*=radio-color-set").change(function(){
      var parent = $(this).parent(".radio-colors");
      var selected = $(" input[type=radio]:checked", parent);
      $(".radio-display", parent).attr("data-color", selected.attr("class"));
    });
  });
}

/*
  UI Styles: Bootstrap Tooltips
*/
function bsTooltips(){
  $('.btn').tooltip();
}

/*
  UI Styles: Dropdown Basket
*/
function dropBasket(){
  $(".basket-control").hover(function(event){
    event.preventDefault();
    $(".basket-prompt").toggleClass("show");
  });
  $("#basket-controller").click(function(event){
    event.preventDefault();
    $(".basket-preview").toggleClass("show");
  });
}

/*
  UI Styles: Product Slider
*/
function pSlider(){

  // Calculate Width
  var sum = 0;
  $("#pslider li.pslide").each(function(){
    sum += ($(this).width());
  });
  $("#pslider").width(sum);

  // First Slide
  var startSlide = $("#pslider li.active").next().attr("id");

  // Total Items
  var totalItems = $('#pslider li').length;

  // Settings
  $(".pslide-label").html("1 of " + totalItems);
  $(".prev").addClass("disabled");
  $(".next").removeClass("disabled");

  // Slider Control: Next
  var slide = 0;

  $(".next").click(function(event){
    event.preventDefault();

    // Enable Prev if disabled
    $(".prev").removeClass("disabled");

    // Active Slides (prev/next)
    var $targetItem = $("#pslider li.active").next();
    $targetItem.addClass("active");
    var $prevItem = $("#pslider li.active").prev("li");
    $prevItem.removeClass("active");

    // Current Item
    var $currentItem = $("#pslider li.active");
    var currentSlide = $currentItem.attr("data-slide");

    // Next Slide Number
    var nextSlide = $targetItem.attr("data-slide");

    // label
    if (currentSlide == totalItems) {
      $(".pslide-label").html(currentSlide + " of " + totalItems);
      $(this).addClass("disabled");
    }
    else {
      $(".pslide-label").html(nextSlide + " of " + totalItems);
    }

    // Slide
    if (sum !== (slide+213)) {
      slide += 213;
    }
    
    $(".pslider li").css({
      'transform': 'translate3d(-' + slide + 'px,0,0)',
      'transition': 'all 0.35s ease-out'
    });

  });

  // Slider Control: Prev
  $(".prev").click(function(event){
    event.preventDefault();

    // Active Slides (prev/next)
    var $targetItem = $("#pslider li.active").prev();
    $targetItem.addClass("active");
    var $prevItem = $("#pslider li.active").next("li");
    $prevItem.removeClass("active");

    // Current Item
    var $currentItem = $("#pslider li.active");
    var currentSlide = $currentItem.attr("data-slide");

    // Next Slide Number
    var nextSlide = $targetItem.attr("data-slide");

    // label
    if (currentSlide == "1") {
      $(".pslide-label").html(currentSlide + " of " + totalItems);
      $(this).addClass("disabled");
    }
    else {
      $(".pslide-label").html(nextSlide + " of " + totalItems);
    }

    // alert("Sum: " + sum + " - Slide Pos: " + slide);
    if (sum !== (slide+213)) {
      slide -= 213;
    }
    else if (slide == (sum-213)) {
      slide -= 213;
       $(".next").removeClass("disabled");    
    }
    else {
      slide = 0;
    }
    $(".pslider li").css({
      'transform': 'translate3d(-' + slide + 'px,0,0)',
      'transition': 'all 0.35s ease-out'
    });

  });

}

/*
  UI Styles: Wishlist
*/
function wishlist(){
  $('.wish-add').bind('click', function(event) {
    event.preventDefault();
    event.stopPropagation();
    $('.wish-add a').toggleClass('added');
    $('.wishlist').toggleClass('toggled animate');
  });
}

/*
  UI Styles: Radio Sizes
*/
function radioSizes(){
  $("input").attr("data-set","radio-size-set").change(function(){ // Just use a data-attribute
    var parent = $(this).closest("form");
    var selected = $(" input[type=radio]:checked", parent);
    $(".radio-display", parent).attr("data-size", selected.attr("class"));
  });
}

/*
  UI Styles: Radio Colors
*/
function radioColor(){
  $("input").attr("data-set","radio-color-set").change(function(){
    var parent = $(this).closest("form");
    var selected = $(" input[type=radio]:checked", parent);
    $(".radio-display", parent).attr("data-color", selected.attr("class"));
  });
}

/*
  UI Styles: Visible Elements
*/
function visibleElements(){

  $.fn.visible = function(partial) {
    var $t            = $(this),
        $w            = $(window),
        viewTop       = $w.scrollTop(),
        viewBottom    = viewTop + $w.height(),
        _top          = $t.offset().top,
        _bottom       = _top + $t.height(),
        compareTop    = partial === true ? _bottom : _top,
        compareBottom = partial === true ? _top : _bottom;
    
    return ((compareBottom <= viewBottom) && (compareTop >= viewTop));
  };
    
}

function visibleStuff(){
  var win = $(window);
  var allMods = $(".module");

  allMods.each(function(i, el) {
    var el = $(el);
    if (el.visible(true)) {
      el.addClass("already-visible"); 
    } 
  });

  win.scroll(function(event) { 
    allMods.each(function(i, el) {
      var el = $(el);
      if (el.visible(true)) {
        el.addClass("come-in"); 
      } 
    });
  }); 
}

jQuery(document).ready(function(){
  bsTooltips();
  radioSizes();
  radioColor();
  dropBasket();
  wishlist();
  pSlider();
  menuGroup();
  visibleElements();
  visibleStuff();
});