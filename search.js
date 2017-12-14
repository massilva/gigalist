/*global window, Materialize, YT, $, document*/
/*jslint nomen: true*/
/*jslint plusplus: true */
$(document).ready(function () {
    'use strict';
    var $player = $('#container-player'), $controls = $(".controls");
    function show($element) {
        if (!$element.is(':visible')) {
            $element.show('slow');
        }
    }
    function zip(args) {
        var shortest;
        shortest = !args.length ? [] : args.reduce(function (a, b) {
            return a.length < b.length ? a : b;
        });
        return shortest.map(function (_, i) {
            return args.map(function (array) { return array[i]; });
        });
    }
    function playVideoAt(i) {
        return function () {
            window.player.playVideoAt(i);
        };
    }
    function playVideo(ids) {
        return new YT.Player('player', {
            height: '405',
            width: '100%',
            events: {
                'onReady': function (event) {
                    event.target.cuePlaylist(ids);
                    event.target.playVideo();
                },
                'onStateChange': function (event) {
                    var $videoCard;
                    if (event.data === 0) {
                        event.target.nextVideo();
                    } else if (event.data === 3 || event.data === 5) {
                        event.target.playVideo();
                        $videoCard = $("#" + event.target.getVideoData().video_id);
                        $('.playing').addClass('played').removeClass('playing');
                        $("body, html").animate({scrollTop: $videoCard.offset().top - 12}, 600);
                        $videoCard.removeClass('played').addClass('playing');
                        show($controls);
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
        show($player);
        for (i = 0; i < len; ++i) {
            videoId = orderedResults[i].id.videoId;
            $play = $('<a class="btn-floating halfway-fab waves-effect waves-light red"><i class="material-icons">play_arrow</i></a>').on('click', playVideoAt(i));
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
        window.player = playVideo(ids);
    }
    function get(queries, i, len, maxResults, results) {
        var url = 'https://www.googleapis.com/youtube/v3/search?part=snippet&videoSyndicated=true&videoEmbeddable=true&type=video&safeSearch=strict&maxResults=' + maxResults + '&q=' + encodeURI(queries[i].trim()) + '&key=AIzaSyC8XzaFTF3rAW1q_58Fi2majFEyu1smzUY';
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
    $controls.hide();
    $('.modal').modal();
    $('form#search').on('submit', search);
    $('#next-video').on('click', function () {
        if (window.player.nextVideo) {
            window.player.nextVideo();
        }
    });
    $('#previous-video').on('click', function () {
        if (window.player.previousVideo) {
            window.player.previousVideo();
        }
    });
});
