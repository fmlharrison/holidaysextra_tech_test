var postTemplate = _.template($("#template").html());

$.ajax({
  type: "GET",
  dataType: "jsonp",
  url: "https://api.flickr.com/services/feeds/photos_public.gne?format=json"
});

function jsonFlickrFeed(json) {
  var links = $.map($("img#image"), function(obj, i) { return obj.currentSrc; });

  $.each(json.items, function(i, item) {
    console.log($.inArray(item.media.m, links) !== -1);
    if ($.inArray(item.media.m, links) !== -1) {
      return;
    } else {
    const imageURL = item.media.m;
    const imagePage = item.link;
    const imageTitle = makeTitle(item.title);
    const imageAuthor = createAuthor(item.author);
    const authorURL = "https://www.flickr.com/people/" + item.author_id;
    const imageTags = splitTags(item.tags);

    var postValues = {
      imageLink: imageURL,
      titleLink: imagePage,
      title: imageTitle,
      authorLink: authorURL,
      authorName: imageAuthor,
      tags: imageTags
    };

    $('#row').append(postTemplate(postValues));
    }
  });
}

function splitTags(tags) {
  return tags.split(" ").join(", ");
}

function createAuthor(author) {
  return author.split(/[""]/)[1];
}

function makeTitle(title) {
  if (title.length > 10 ) {
    return title.substr(0, 10) + "...";
  } else {
    return title == " " ? "Untitled" : title;
  }
}

function yHandler() {
  const row = document.querySelector('#row');
  const contentHeight = row.offsetHeight;
  const yOffset = window.pageYOffset;
  const y = yOffset + window.innerHeight;
  if (y >= contentHeight) {
    console.log(1);
    $.ajax({
      type: "GET",
      dataType: "jsonp",
      url: "https://api.flickr.com/services/feeds/photos_public.gne?format=json"
    });
  }
}

var timer;
$(window).scroll(function() {
  clearTimeout(timer);
  timer = setTimeout(function() {
    this.yHandler();
  }, 1000);
});
