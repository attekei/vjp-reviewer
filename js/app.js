// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs
$(document).foundation();

$(document).ready(function() {
  var reviewDoc = localStorage.getItem("reviewDoc");
  var studentPages = JSON.parse(localStorage.getItem("studentPages") || "[]");
  var activeStudentPage = localStorage.getItem("activeStudentPage");

  showReviewDoc();
  listStudentPages();
  showActiveStudentSite();
  initEvents();

  if(reviewDoc) { initPageSplit(); } else { hideReviewArea(); }

  function initPageSplit() {
    $(".review-doc-iframe").show();
    $(".main-section").split({type: 'horizontal', limit: '10'});
  }

  function hideReviewArea() {
    $(".review-doc-iframe").hide();
    $(".student-site-iframe").css({width: "100%", height: "100%"});
  }

  function initEvents() {
    $(".set-review-doc").click(requestReviewDoc);
    $(".set-student-sites").click(requestStudentPages);  
    $(".save-student-sites").click(setStudentSites);
    $(".student-sites").on("click", "a", onSiteLinkClick);
    $(".tab-bar-section").click(toggleReviewHeight);
  }

  function toggleReviewHeight(e) {
    e.preventDefault();
    e.stopPropagation();
    var height = $(".review-doc-iframe").height() > 15 ? 15 : 300;
    $(".review-doc-iframe").height(height);
    $(".hsplitter").css("top", height);
    $(".student-site-iframe").height($(".main-section").height() - height - 4);
  }

  function onSiteLinkClick() {
    if ($(this).data("article")) {
      activeStudentPage = $(this).data("article");
      localStorage.setItem("activeStudentPage", activeStudentPage);
      showActiveStudentSite();
      $('.off-canvas-wrap').foundation('offcanvas', 'hide', 'move-right');
    }
    
  }

  function requestReviewDoc() {
    var newValue = prompt("Enter url of review document");
    if (newValue !== null) {
      if (!reviewDoc && newValue) initPageSplit();
      reviewDoc = newValue;
      localStorage.setItem("reviewDoc", reviewDoc);
      showReviewDoc();
    }
  }

  function requestStudentPages() {
    $(".studentsites-prompt").show();

    if (studentPages) {
      $(".studentsites-textarea").val(studentPages.join("\n"));  
    }
  }

  function setStudentSites() {
    var newValue = $(".studentsites-textarea").val();
    if (newValue) {
      studentPages = newValue.split("\n");
      localStorage.setItem("studentPages",JSON.stringify(studentPages));
    }
    $(".studentsites-prompt").hide();
    listStudentPages(); 
  }

  function listStudentPages() {
    studentPages = studentPages || [];
    $(".student-sites").html(
      studentPages.map(function(page) {
        return '<li><a data-article="'+page+'">'+page.match(/\~(.*?)\//)[1]+'</a></li>';
      }).join("")
    );
  }


  function showReviewDoc() {
    if (reviewDoc) {
      $(".review-doc-iframe").removeAttr("srcdoc").attr("src", addHttp(reviewDoc));
    }
  }

  function showActiveStudentSite() {
    if (activeStudentPage) {
      $(".student-site-iframe").removeAttr("srcdoc").attr("src", addHttp(activeStudentPage));
      $(".title").html(
        "VJP Reviewer - " + activeStudentPage.match(/\~(.*?)\//)[1]
      );
    }
  }
  function addHttp(url) {
    if (!/^https?:\/\//i.test(url)) {
        url = 'http://' + url;
    }
    return url;
  }
});