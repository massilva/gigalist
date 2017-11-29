function search() {
   	var url, q = $('#query').val(), len, i;
    url = 'https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=50&q=' + q + '&key=AIzaSyC8XzaFTF3rAW1q_58Fi2majFEyu1smzUY';
  	$.get(url,
     	function (r) {
            var $image, items = r.items, image;
            len = items.length;
            $("#search-container").empty();
            for (i = 0; i < len; i++) {
                $image = $("<img>");
                image = items[i].snippet.thumbnails.medium;
                $image.attr({src: image.url, height: image.height, width: image.width});
                $("#search-container").append($image);
            }
        }
    );
}
