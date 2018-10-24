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
    scrollTop,
    navBool;

var md = new MobileDetect(window.navigator.userAgent);

function msieversion() {

    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))  // If Internet Explorer, return version number
    {
        return true;
    }
    else  // If another browser, return 0
    {
        return false;
    }

    return false;
}

var ie = msieversion();

var videos = [];

$(function() {
  navBool = false;
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

  if(md.mobile()) {
    $('body').addClass('mobile');
  } else {
    $('body').addClass('not-mobile');
  }

  if(ie) {
    $('body').addClass('ie');
  }
  
  $(window).scroll(scrollAnimation);

  $("#top").click(function(e){
    $nav.css("top",'');
    e.preventDefault();
    scrollTo($('#begin'));
  });

  initBrowser();
  initVideo();

  $("a[rel=external]").attr("target","_blank");

  var frame = 1;
  var up = true;
  // setInterval(function(){
  //   if(frame < 8 && up == true) {
  //     frame ++;
  //     up = true;
  //   } else {
  //     frame --;
  //     up = false;
  //   }

  //   if(frame == 0) {
  //     frame = 1;
  //     up = true;
  //   }

  //   $('#favicon').attr('href','/img/humans/0'+frame+'.png');
  // },100);

});

function scrollAnimation() {
  window.requestAnimationFrame(scroll);
}

function scroll() {
  var section_h = $section.height();
  scrollTop = $(this).scrollTop();
  var scrollDif = scrollTop - scrollVal;
  var inProgress = true;
  var navOffset = parseInt($("nav").css('top'),10) - scrollTop;
  if(scrollDif < 0 && scrollTop > 0 && navOffset < -45) {
    showNav();
  } else {
    hideNav();
  }

  if(navOffset > 0) {
    stickyNav();
  }

  if (scrollTop <= 0 ) {
    $nav.css('top',0);
  }

  var docheight = $(document).height();

  if(scrollTop >= docheight - window.innerHeight) {
    showNav();
  }

  if(scrollTop > docheight - section_h * 10) {
    count++;
    if(count >= 40) {
      if($('#begin').find('#end').length == 0) {
        $("#end").appendTo('#begin').css("display","block");
      }
      return false;
    }
    var new_sections = sections.clone();

    var frame_count = 43;

    new_sections.each(function() {
      if(section_count < frame_count) {
        section_count ++;
      } else {
        section_count = 0;
      }
      var $cat = $(".cat",this);
      $cat.attr('class','cat');
      var new_class = zeroPad(section_count, 2);
      $cat.prev(".image-fill").find('img').attr('src', 'img/shapes/shapes000'+new_class+'.png');
      $cat.addClass("f"+new_class);
      $("#begin").append(new_sections);
    });
  }
  scrollVal = scrollTop;

  //if(!md.mobile()) {
  scrollVideo();
  //}
}

function showNav() {
  if(!$nav.hasClass('sticky')) {
    navBool = true;
    $nav.css('top', -50);
    setTimeout(function(){
      $nav.addClass('sticky');
      $nav.addClass('slideIn');
      $nav.css('top',0);
    },50);
  }
}

function stickyNav() {
  if(!$nav.hasClass('sticky')) {
    navBool = true;
    $nav.css({
      'top': 0,
      'transition': 'none'
    });
    $nav.addClass('sticky');
    setTimeout(function(){
      $nav.css('transition', '');
    },50);
  }
}

function hideNav() {
  if($nav.hasClass('sticky')) {
    navBool = false;
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
    // $(this).click(function() {
    //   $(this).closest(".browser").toggleClass('maxied');
    // });
    var title = $this.attr('title');
    var style = $this.attr('style');
    if(typeof title === 'undefined') {
      title = "";
    }
    var before_html = '<div class="browser maxied" style="'+style+'">';
        before_html +=  '<h4 class="title">';
        before_html +=    title;
        before_html +=  '</h4>';
        before_html +=  '<ul class="ui">';
        before_html +=    '<li class="close"></li>';
        before_html +=    '<li class="min"></li>';
        before_html +=    '<li class="max"></li>';
        before_html +=  '</ul>';
        before_html +=  '<div class="window" style="'+style+'"></div></div>';

    var after_html = "</div></div>";

    $(this).before(before_html);
    $(this).appendTo($(this).prev('.browser').find('.window'));
  });

  // $('.ui .min').click(function(){
  //   $(this).closest('.browser').removeClass('maxied').toggleClass('minied');
  // });

  // $('.ui .max').click(function(){
  //   $(this).closest('.browser').removeClass('minied').toggleClass('maxied');
  // });

  // $('.ui .close').click(function() {
  //   if(confirm("Are you sure you want to close this project?\n\nYou'll have to refresh the page to see it again, in addition to hurting Andrew's feelings.")) {
  //     $(this).closest('.browser').removeClass('minied').removeClass('maxied').addClass('closed');
  //   }
  // });
}

function initVideo() {

  $("video").each(function(){
    var $this = $(this);
    var video = $this.get(0);
    video.volume = 0;

    var video = {

      el: $this,
      vid: $this.get(0),
      timeout: null

    }
    
    $this.bind('ended', function() {
      video.vid.currentTime = 0;
      video.el.prev('.play').addClass('paused');
      pauseVideo(video.vid);
    });

    videos.push(video);
  });

  $("video").before("<span class='play'></span>");

  $(".play").click(function() {
    toggleVideo($(this));
  });
}

function toggleVideo($this) {
  $this.toggleClass('playing');
  var video = $this.next("video").get(0);
  if(video.paused === true) {
    $this.closest(".browser").addClass('maxied');
    $this.removeClass('paused');
    video.play();
    audioFadeIn(video);
  } else {
    video.pause();
    $this.addClass('paused');
    //$this.closest(".browser").removeClass('maxied');
  }
}

function playVideo(vid) {

  if(vid.paused) {
    vid.play();
  }

  if(!vid.paused) {
       
    if(!md.mobile()) {
      vid.muted = false;
      audioFadeIn(vid);
    }

    if(!vid.paused) {
      $(vid).prev('.play').addClass('playing');
      $(vid).closest(".browser").addClass('maxied');
    }
    

  }

}

function pauseVideo(vid) {
  $(vid).prev('.play').removeClass('playing');
  //$(vid).closest(".browser").removeClass('maxied');
  audioFadeOut(vid);
  if (vid.paused === false) {
    vid.timeout = setTimeout(function() {
      vid.pause();
      vid.timeout = null;
    }, 1000);
  }
}

function audioFadeIn(vid) {
  
  if(vid.volume < 0.9) {

    vid.volume += 0.01;

    setTimeout(function() {
      audioFadeIn(vid);
    }, 50);

  }

}

function audioFadeOut(vid) {
  
  if(vid.volume > 0.01) {

    vid.volume -= 0.01;

    setTimeout(function() {
      audioFadeOut(vid);
    }, 50);

  }

}


function scrollVideo() {

  $.each( videos, function( key, video ) {

    $this = video.el.prev('.play');

    if(isElementInViewport(video.vid)) {
      if(video.vid.paused === true && !$this.hasClass('paused')) {
        playVideo(video.vid);
      }
    } else {
      if(video.vid.paused === false && video.timeout === null) {
        pauseVideo(video.vid);
      }
      
    }

  });

}



function isElementInViewport (el) {

    var rect = el.getBoundingClientRect();

    return (
        rect.top >= -window.innerHeight / 2 &&
        rect.top <= ($(el).height() * 2)
    );
}
