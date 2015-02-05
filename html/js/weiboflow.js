/**
 * Created by frank on 12/6/14.
 */

var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i) ? true : false;
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i) ? true : false;
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i) ? true : false;
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Windows());
    }
};

var initDisplay = 20; // number to display on initialization
var currentIndex = 0; // record number has been displayed
var loadPerScroll = 30; // load another number per scroll
var fadeInTime = 2000;
var dataArray = null; // hold json data
var dataArrayBackup = null;
var totalLen; // total number, length of dataArray
var mobile = isMobile.any();

if( mobile )
{
    loadPerScroll = 8; // on mobile client, load less per scorll
}

jsonLoad(json_prefix + currentYear + ".json");

$(window).on('load', function() {
    $('.img_up').fancybox({
        helpers: {
            overlay: {
                locked: false
            }
        }
    });

    waterfall();
    $(window).on('scroll', function() {
        if(checkScrollSlide()) { // scroll condition qualified
            if (currentIndex < totalLen) {
                for (var i=0; i < loadPerScroll; i++) {
                    insertCard(dataArray[currentIndex]);
                    currentIndex += 1;
                    if (currentIndex >= totalLen) {
                        break;
                    }
                }
                waterfall();
            }
        }
    })
})

function jsonLoad(jsonFile) {
    $.getJSON(jsonFile, function(data) {
        dataArray = data;
        dataArrayBackup = dataArray;
        totalLen = dataArray.length;
        $.each(data, function(index, value) { // initialization
            if (index < initDisplay) {
                insertCard(value);
                currentIndex += 1;
            }
        })
        waterfall();
    })
}

function jumpTo(year) {
    lunrIndex = null;
    wbcard_cancel_search();
    if (year != currentYear) {
        $('#main').remove();
        $('<div>').attr('id', 'main').appendTo($('#row'));
        $("html, body").animate({ scrollTop: 0 }, 120);
        currentIndex = 0;
        jsonLoad(json_prefix + year + ".json");
        currentYear = year;
    }
}

function calHeight(size) {
    var arr = size.split(",");
    var width = parseInt(arr[0]);
    var height = parseInt(arr[1]);
    if (Math.floor(120 * width / height) <= 200) { // scale to height == 120 & width <= 200
        return "120px";
    } else {
        height = Math.floor(200 * height / width); // scale to width == 200
        return height + "px";
    }
}

function insertCard(data) {
    var oBox = $('<div>').addClass('box').addClass('module').addClass('already-visible').addClass('come-in').appendTo($('#main'));
    if (!mobile) { // add opacity gradient on PC client
        oBox.css('opacity', 0);
    }

    // add original weibo link
    var oBarFull = $('<div>').addClass('bar-full').appendTo(oBox);
    $('<span>').addClass('bar').appendTo(oBarFull);
    var oBarBox = $('<div>').addClass('bar-box').appendTo(oBarFull);
    var oBarFlip = $('<span>').addClass('bar-flip').appendTo(oBarBox);
    $('<a>').addClass('origin_link').attr('href', data.original_link)
        .attr('target', '_blank').text('阅读原微博').appendTo(oBarFlip);

    // add author, avatar and tags if exists
    var oContent = $('<div>').addClass('content').addClass('pad').appendTo(oBox);
    var oRow = $('<div>').addClass('row').appendTo(oContent);
    var oColxs4 = $('<div>').addClass('col-xs-4').appendTo(oRow);
    var oImageBorder = $('<div>').addClass('img_border').appendTo(oColxs4);
    $('<img>').addClass('img_circle').attr('src', data.profile_photo).appendTo(oImageBorder);
    var oColsx8 = $('<div>').addClass('col-xs-8').addClass('origin_post').appendTo(oRow);
    var oH5 = $('<h5>').appendTo(oColsx8);
    $('<a>').attr('href', data.poster_link).attr('target', '_blank').text(data.poster_name).appendTo(oH5);
    $('<p>').addClass('time_label').text(data.post_time).appendTo(oColsx8);
    if (data.tags != undefined) {
        var oRow2 = $('<div>').addClass('row').css({
            'margin-top': '10px',
            'margin-bottom': '-10px'
        }).appendTo(oContent);
        var oIcon = $('<div>').addClass('col-xs-1').appendTo(oRow2);
        $('<span>').addClass('glyphicon glyphicon-tags').appendTo(oIcon);
        var oTag = $('<div>').addClass('col-xs-10').appendTo(oRow2);
        $('<span>').text(data.tags).appendTo(oTag);
        $('<div>').addClass('col-xs-1').appendTo(oRow2);
    }

    // add status text
    $('<hr>').appendTo(oContent);
    $('<p>').html(data.text).appendTo(oContent);

    // add retweet status if exists
    if (data.retweet_text != undefined) {
        var oRetweet = $('<div>').addClass('retweet_post').appendTo(oContent);
        var oPleft = $('<p>').addClass('left_text').appendTo(oRetweet);
        $('<a>').attr('href', data.retweet_poster_link).attr('target', '_blank').text(data.retweet_poster_name).appendTo(oPleft);
        $('<p>').addClass('left_text').html(data.retweet_text).appendTo(oRetweet);
        if (data.retweet_img_url != undefined) { // add image if exists
            var oImgUp = $('<a>').addClass('img_up').attr('href', data.retweet_img_url).appendTo(oRetweet);
            $('<img>').addClass('post_img').attr('src', data.retweet_img_url).css({'height': calHeight(data.retweet_img_size)}).appendTo(oImgUp);
        }
    } else {
        if (data.img_url != undefined) {
            var oImgCenter = $('<div>').addClass('img_center').appendTo(oContent);
            var oImgUp = $('<a>').addClass('img_up').attr('href', data.img_url).appendTo(oImgCenter);
            $('<img>').addClass('post_img').attr('src', data.img_url).css({'height': calHeight(data.img_size)}).appendTo(oImgUp);
        }
    }

    if(!mobile) {
        oBox.animate({
            opacity: 1
        }, fadeInTime, "swing")
    }
}

function waterfall() {
    var $boxes = $('#main>div');
    var w = $boxes.eq(0).outerWidth();
    var cols = Math.floor($(window).width() / w);
    $('#main').width(w * cols).css('margin', '0 auto');
    var hArr = [];
    $boxes.each(function(index, value) { // start water fall calculation, append next card to the shortest column
        var h = $boxes.eq(index).outerHeight();
        if(index < cols) {
            hArr[index] = h;
        } else {
            var minH = Math.min.apply(null, hArr);
            var minHIndex = $.inArray(minH, hArr);
            $(value).css({
                'position': 'absolute',
                'top': minH + 'px',
                'left': minHIndex * w + 'px'
            })
            hArr[minHIndex] += h;
        }
    })

    $('body').css('height', (Math.max.apply(null, hArr) + 50) + 'px'); // if the height not set, background color change may fail
}

function checkScrollSlide() {
    var $lastBox = $('#main>div').last();
    var lastBoxDis = $lastBox.offset().top + 200;
    var scrollTop = $(window).scrollTop();
    var documentH = $(window).height();
    return (lastBoxDis < scrollTop + documentH) ? true : false;
}

/****************************** search ******************************/

var lunrIndex = null;
var searchResult = null;

function wbcard_lunr_init() {
    lunrIndex = lunr(function () {
        this.field('search_field');
        this.ref("_id_");
    });
    if (dataArrayBackup != null) {
        for(var i = 0; i< dataArrayBackup.length; i++)
            lunrIndex.add(dataArrayBackup[i]);
        console.log("Lunr search successfully inited.")
    }
}

function searchSubmit() {
    wbcard_search($("#search-text").val());
}

function wbcard_search(query) {
    if (lunrIndex == null) {
        wbcard_lunr_init();
    }
    searchResult = new Array(); // 清空

    tmpRes = lunrIndex.search(query);
    for(var i = 0; i < tmpRes.length; i++) {
        searchResult.push(dataArrayBackup[parseInt(tmpRes[i]['ref'])]);
    }

    $("#search_cancel").height($("#search-text").height());
    $("#search_cancel").css('display', 'inherit');
    displaySearchResult();
}

function wbcard_cancel_search() {
    if(searchResult != null) {
        searchResult = null;
        $("#search_cancel").css('display', 'none');
        $("#search-text").val("");
        displaySearchResult();
    }
}

function displaySearchResult() {
    $('#main').remove();
    $('<div>').attr('id', 'main').appendTo($('#row'));
    $("html, body").animate({ scrollTop: 0 }, 120);
    currentIndex = 0;

    if(searchResult == null) {
        dataArray = dataArrayBackup;
    } else {
        dataArray = searchResult;
    }
    if(dataArray.length > 0) {
        totalLen = dataArray.length;
        $.each(dataArray, function(index, value) { // initialization
            if (index < initDisplay) {
                insertCard(value);
                currentIndex += 1;
            }
        })
        waterfall();
    } else {
        $("#main").css("text-align", 'center');
        $("<div>").addClass("alert alert-warning").css({
            'width': '40%',
            'margin': 'auto'
        }).text("没有匹配项。").appendTo($("#main"));
    }
}