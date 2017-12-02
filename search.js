/*global Materialize, YT*/
/*jslint nomen: true*/
/*jslint plusplus: true */
$(document).ready(function () {
    'use strict';
    function zip(args) {
        var shortest;
        shortest = !args.length ? [] : args.reduce(function (a, b) {
            return a.length < b.length ? a : b;
        });
        return shortest.map(function (_, i) {
            return args.map(function (array) { return array[i]; });
        });
    }
    function playVideo(videoId) {
        return new YT.Player('player', {
            height: '405',
            width: '100%',
            videoId: videoId,
            events: {
                'onReady': function (event) { event.target.playVideo(); },
                'onStateChange': function (event) {
                    if (event.data === 0) {
                        console.log('Próximo vídeo');
                    }
                }
            }
        });
    }
    function processResults(results) {
        var i, player, orderedResults, len, image, snippet, $image, $card, $cardImage, $cardContent, $play;
        $('#search-container').empty();
        $('#preloader-modal').modal('close');
        orderedResults = zip(results).reduce(function (a, b) { return a.concat(b); });
        player = playVideo(orderedResults[0].id.videoId);
        len = orderedResults.length;
        if (!$('#player').is(':visible')) {
            $('#player').show('slow');
        }
        for (i = 0; i < len; ++i) {
            $play = $('<a class="btn-floating halfway-fab waves-effect waves-light red"><i class="material-icons">play_arrow</i></a>');
            $image = $('<img></img>');
            $card = $('<div id="' + orderedResults[i].id.videoId + '" class="card"></div>');
            $cardImage = $('<div class="card-image"></div>');
            $cardContent = $('<div class="card-content"></div>');
            snippet = orderedResults[i].snippet;
            image = snippet.thumbnails.medium;
            $image.attr({src: image.url, height: image.height, width: image.width});
            $cardImage.append($image).append($play);
            $cardContent.append(snippet.title);
            $card.append($cardImage).append($cardContent);
            $('#search-container').append($('<div class="col s12 m6 l4"></div>').append($card));
        }
    }
    function get(queries, i, len, maxResults, results) {
        var url = 'https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=' + maxResults + '&q=' + encodeURI(queries[i].trim()) + '&key=AIzaSyC8XzaFTF3rAW1q_58Fi2majFEyu1smzUY';
        $.get(url).done(function (r) {
            results.push(r.items);
            i++;
            if (i < len) {
                get(queries, i, len, maxResults, results);
            } else {
                processResults(results);
            }
        }).fail(function () {
            Materialize.toast('<i class="medium material-icons red-text">highlight_off</i> Infelizmente, houve um erro.', 3000);
            processResults(results);
        });
    }
    function search() {
        var queries, q = $('#query').val();
        queries = q.split(';');
        $('#preloader-modal').modal('open');
        get(queries, 0, queries.length, parseInt(50 / queries.length, 10), []);
    }
    $('#player').hide();
    $('.modal').modal();
    $('form#search').on('submit', search);
});
