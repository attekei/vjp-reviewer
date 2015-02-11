// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs
$(document).foundation();

$(document).ready(function() {
  var reviewDoc = sessionStorage.getItem("reviewDoc");
  var studentPages = JSON.parse(sessionStorage.getItem("studentPages") || "[]");
  var activeStudentPage = sessionStorage.getItem("activeStudentPage");

  showReviewDoc();
  listStudentPages();
  showActiveStudentSite();
  initPageSplit();
  initEvents();

  function initPageSplit() {
    $(".main-section").split({type: 'horizontal'});
  }

  function initEvents() {
    $(".set-review-doc").click(requestReviewDoc);
    $(".set-student-sites").click(requestStudentPages);  
    $(".save-student-sites").click(setStudentSites);
    $(".student-sites").on("click", "a", onSiteLinkClick);
  }

  function onSiteLinkClick() {
    if ($(this).data("article")) {
      activeStudentPage = $(this).data("article");
      sessionStorage.setItem("activeStudentPage", activeStudentPage);
      showActiveStudentSite();
    }
    
  }

  function requestReviewDoc() {
    var promptValue = prompt("Enter url of review document");
    if (promptValue) {
      reviewDoc = promptValue;
      sessionStorage.setItem("reviewDoc", reviewDoc);
      showReviewDoc();
    }
  }

  function requestStudentPages() {
    $(".studentsites-prompt").show();
  }

  function setStudentSites() {
    var promptValue = $(".studentsites-textarea").val();
    if (promptValue) {
      studentPages = _.chunk(promptValue.split("\n"), 2);
      sessionStorage.setItem("studentPages",JSON.stringify(studentPages));
    }
    $(".studentsites-prompt").hide();
    listStudentPages(); 
  }

  function listStudentPages() {
    studentPages = studentPages || [];
    $(".student-sites").html(
      studentPages.map(function(page) {
        return '<li><a data-article="'+page[0]+'">'+page[1]+'</a></li>';
      }).join()
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
        "VJP Reviewer - " + studentPages.filter(function(p) { return p[0] == activeStudentPage; })[0][1]
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