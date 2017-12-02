/*global window, Materialize, YT*/
/*jslint nomen: true*/
/*jslint plusplus: true */
$(document).ready(function () {
    'use strict';
    var $player = $('#container-player');
    function zip(args) {
        var shortest;
        shortest = !args.length ? [] : args.reduce(function (a, b) {
            return a.length < b.length ? a : b;
        });
        return shortest.map(function (_, i) {
            return args.map(function (array) { return array[i]; });
        });
    }
    function playVideo(ids) {
        return new YT.Player('player', {
            height: '405',
            width: '100%',
            events: {
                'onReady': function (event) {
                    console.log('onReady', event);
                    event.target.cuePlaylist(ids);
                    event.target.playVideo();
                },
                'onStateChange': function (event) {
                    console.log('stateChange', event.data);
                    if (event.data === 0) {
                        event.target.nextVideo();
                    } else if (event.data === 3 || event.data === 5) {
                        event.target.playVideo();
                        $('.playing').removeClass('playing');
                        $('#' + event.target.getVideoData().video_id).addClass('playing');
                    }
                }
            }
        });
    }
    function processResults(results) {
        var i, ids = [], orderedResults, len, image, snippet, videoId, $image, $card, $cardImage, $cardContent, $play;
        $('#search-container').empty();
        $('#preloader-modal').modal('close');
        orderedResults = zip(results).reduce(function (a, b) { return a.concat(b); });
        len = orderedResults.length;
        if (!$player.is(':visible')) {
            $player.show('slow');
        }
        for (i = 0; i < len; ++i) {
            videoId = orderedResults[i].id.videoId;
            $play = $('<a class="btn-floating halfway-fab waves-effect waves-light red"><i class="material-icons">play_arrow</i></a>');
            $image = $('<img></img>');
            $card = $('<div id="' + videoId + '" class="card"></div>');
            $cardImage = $('<div class="card-image"></div>');
            $cardContent = $('<div class="card-content"></div>');
            snippet = orderedResults[i].snippet;
            image = snippet.thumbnails.medium;
            $image.attr({src: image.url, height: image.height, width: image.width});
            $cardImage.append($image).append($play);
            $cardContent.append(snippet.title);
            $card.append($cardImage).append($cardContent);
            $('#search-container').append($('<div class="col s12 m6 l4"></div>').append($card));
            ids.push(videoId);
        }
        playVideo(ids);
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
    $player.hide();
    $('.modal').modal();
    $('form#search').on('submit', search);
});
