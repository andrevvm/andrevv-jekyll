var html_length = new Array();
var html_index = 0;
var match_index = 0;
var total_html_count = 0;
var current_letter;
var matches = new Array();
var w_height;

var html = new Object;

var in_html = false;
var up = true;

$(function(){
  init();
});

$(window).scroll(function() {
  w = $(this).scrollTop();

  /* ******************* */
  /* typed_text
  /* *********************/
    $(".type_section").each(function() {
      type_text('#'+$(this).attr('id'));
    })
});

function type_text (section) {
    var typed_texts_rel = w - ($(section).data("scrolls")[0] - (w_height / 2.2));
    var typed_texts_ratio = (typed_texts_rel / ($(section).data("scrolls")[2]));
    var sub_s = ($(section+"_typed").data("typed_text_l")) * typed_texts_ratio

    var old_text = $(section+"_typed").html().length;

    var new_typed_text = $(section+"_typed").data("typed_text").substr(0,Math.round(sub_s));

    var pattern = /\|([0-9+])/gm;
    new_typed_text = new_typed_text.replace(pattern, function(match, $1, offset, original) { return returnHtml($1); });
    
    if(old_text != new_typed_text.length) {
      $(".t_cursor").css("visibility","visible");
      new_typed_text = new_typed_text.replace('|','');
      $(section+"_typed").html(new_typed_text);
    }
}

function returnHtml(n) {
  var n = n - 1;
  return html['html-'+n];
}

function set_section_scrolls() {
  w_height = $(window).height();
  $(".section").each(function(){
    var scrolls = new Array()
    scrolls[0] = $(this).offset().top;
    scrolls[1] = $(this).offset().top + 180;
    scrolls[2] = scrolls[1] - scrolls[0];
    $(this).data("scrolls",scrolls);
  });
}

function init() {
  $("body").hide();
  $("body").fadeIn(600);
  set_image_heights();
  var currentTime = new Date();
  var hour = currentTime.getHours();
  var greet;
  if(hour >= 17 || hour < 3) {
    greet = 'evening';
    color = '#444F65';
    //$("html").css({'background-image':'url(img/'+greet+'.svg)'});
    $("html").css({'background-color':color});
  }
  if(hour >= 3 && hour < 12) {
    greet = 'evening';
    $("html").css({'background-image':'url(img/'+greet+'.svg)'});
  }

  if(hour >= 14 && hour < 17) {
    greet = 'afternoon';
  }

  w_height = $(window).height();
  $("#intro").height(w_height);
  //$("#content").css({'margin-top':w_height});


  $("#greet").text(greet);

  $("pre.typed_section").each(function() {
    var new_html = $(this).html();
    
    pattern = /(<.*?>)/gm;
    matches.push($(this).html().match(pattern));
    new_html = new_html.replace(pattern, replaceHtml);

    pattern = /(&.*?;)/gm;
    matches.push($(this).html().match(pattern));
    new_html = new_html.replace(pattern, replaceHtml);
    $(this).html(new_html);
  });

  function replaceHtml(el) {
    html_index++;
    return "|"+html_index;
  }

  for(var i=0; i < matches.length; i++) {
    if(matches[i]) {
      for(var n=0; n < matches[i].length; n++) {
        html['html-'+match_index] = matches[i][n];
        match_index++;
      }
    }
  }

  document.onkeypress = function(evt) {
      evt = evt || window.event;
      var charCode = evt.which || evt.keyCode;
      var charTyped = String.fromCharCode(charCode);
      $("#appicns_typed").append(charTyped);
  };

  var cursor_blink = setInterval(function() {
    $(".t_cursor").toggleClass("blink").css("visibility","");
  }, 500);
  set_section_scrolls();
  $(window).resize(set_section_scrolls);
  $(".typed_section").each(function() {
    $(this).data("typed_text", $(this).html());
    $(this).data("typed_text_l", 10);
    $(this).data("old_sub_s", 0);
  });
  $(".typed_section").html('');

}

function set_image_heights() {
  $("img").each(function () {
    console.log($(this).outerHeight());
  });
}