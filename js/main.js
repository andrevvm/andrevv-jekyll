var $nav,
    $section,
    $window,
    $doc,
    doc_h,
    window_h,
    html,
    sections,
    section_count,
    count,
    scrollVal,
    scrollTop;


$(function() {

  $section = $('.section').eq(0);
  $window = $(window);
  $doc = $(document);
  window_h = $window.height();
  doc_h = $doc.height() - window_h;
  html = $("#begin").html();
  sections = $("#begin .section");
  section_count = sections.length - 1;
  count = 0;
  scrollVal = 0;
  $nav = $("nav");
  $("#content").hide();
  $("#content").fadeIn(600);
  
  setInterval(scroll,10);

  $("#top").click(function(e){
    $nav.css("top",'');
    e.preventDefault();
    scrollTo($('#begin'));
  });

  initBrowser();
  initVideo();

  $("a[rel=external]").attr("target","_blank");

});

function scroll() {
  var section_h = $section.height();
    scrollTop = $(this).scrollTop();
    var scrollDif = scrollTop - scrollVal;
    var inProgress = true;
    if(scrollDif < 0 && scrollTop > 0) {
      showNav();
    } else {
      hideNav();
    }

    if (scrollTop <= 0) {
      $nav.css('top',0);
    }

    

    var docheight = $(document).height();
    if(scrollTop > docheight - section_h * 3) {
      count++;
      if(count >= 10) {
        if($('#begin').find('#end').length == 0) {
          $("#end").appendTo('#begin').css("display","block");
        }
        return false;
      }
      var new_sections = sections.clone();
      new_sections.each(function() {
        if(section_count < 12) {
          section_count ++;
        } else {
          section_count = 0;
        }
        var $cat = $(".cat",this);
        $cat.removeClass("f00 f01 f02 f03 f04 f05 f06 f07 f08 f09 f10 f11 f12");
        var new_class = zeroPad(section_count, 2);
        $cat.addClass("f"+new_class);
        $("#begin").append(new_sections);
      });
    }
    scrollVal = scrollTop;
}

function showNav() {
  if(!$nav.hasClass('sticky')) {
    $nav.css('top', -50);
    setTimeout(function(){
      $nav.addClass('sticky');
      $nav.addClass('slideIn');
      $nav.css('top',0);
    },50);
  }
}

function hideNav() {
  if($nav.hasClass('sticky')) {
    var currentPos = $nav.offset().top;
    $nav.removeClass('sticky');
    $nav.css("top",currentPos);
  }
}

function scrollTo(section, callback) {
  var offset = section.offset().top;
  if(offset < 0) { offset = 0;}
  $('body,html').animate({
    scrollTop: offset
  }, 6000, 'easeInOutQuad', callback);
}

function zeroPad(num, places) {
  var zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
}

function initBrowser() {

  $(".browser_img").each(function() {
    var $this = $(this);
    $(this).click(function() {
      $(this).closest(".browser").toggleClass('maxied');
    });
    var title = $this.attr('title');
    if(typeof title === 'undefined') {
      title = "";
    }
    var before_html = '<div class="browser">';
        before_html +=  '<h4 class="title">';
        before_html +=    title;
        before_html +=  '</h4>';
        before_html +=  '<ul class="ui">';
        before_html +=    '<li class="close"></li>';
        before_html +=    '<li class="min"></li>';
        before_html +=    '<li class="max"></li>';
        before_html +=  '</ul>';
        before_html +=  '<div class="window"></div></div>';

    var after_html = "</div></div>";

    $(this).before(before_html);
    $(this).appendTo($(this).prev('.browser').find('.window'));
  });

  $('.ui .min').click(function(){
    $(this).closest('.browser').removeClass('maxied').toggleClass('minied');
  });

  $('.ui .max').click(function(){
    $(this).closest('.browser').removeClass('minied').toggleClass('maxied');
  });

  $('.ui .close').click(function() {
    if(confirm("Are you sure you want to close this project?\n\nYou'll have to refresh the page to see it again, in addition to hurting Andrew's feelings.")) {
      $(this).closest('.browser').removeClass('minied').removeClass('maxied').addClass('closed');
    }
  });
}

function initVideo() {

  $("video").each(function(){
    var $this = $(this);
    var video = $this.get(0);
    $this.bind('ended', function() {
      $this.closest(".browser").removeClass('maxied');
      $this.prev('.play').removeClass('playing');
      video.currentTime = 0;
    });
  });

  $("video").before("<span class='play'></span>");

  $(".play").click(function() {
    var $this = $(this);
    $this.toggleClass('playing');
    var video = $(this).next("video").get(0);
    if(video.paused === true) {
      $(this).closest(".browser").addClass('maxied');
      video.play();
    } else {
      video.pause();
      $(this).closest(".browser").removeClass('maxied');
    }
  });
}