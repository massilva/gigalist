$(document).ready(function () {
    $('.modal').modal();
    function search() {
        var url, q = $('#query').val(), len, i, template, $preloader = $('#preloader-modal');
        url = 'https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=50&q=' + q + '&key=AIzaSyC8XzaFTF3rAW1q_58Fi2majFEyu1smzUY';
        $preloader.modal('open');
        $.get(url,
            function (r) {
                var $image, $card, items = r.items, image, snippet, $cardImage, $cardContent, $play;
                len = items.length;
                $('#search-container').empty();
                for (i = 0; i < len; i++) {
                    $play = $('<a class="btn-floating halfway-fab waves-effect waves-light red"><i class="material-icons">play_arrow</i></a>');
                    $image = $('<img></img>');
                    $card = $('<div class="card"></div>');
                    $cardImage = $('<div class="card-image"><div>');
                    $cardContent = $('<div class="card-content"></div>');
                    snippet = items[i].snippet;
                    image = snippet.thumbnails.medium;
                    $image.attr({src: image.url, height: image.height, width: image.width});
                    $cardImage.append($image).append($play);
                    $cardContent.append(snippet.title);
                    $card.append($cardImage).append($cardContent);
                    $('#search-container').append($('<div class="col s12 m6 l4"></div>').append($card));
                }
                $preloader.modal('close');
            }
        );
    }
    $('form#search').on('submit', search);
});
