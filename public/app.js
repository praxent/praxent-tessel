
$(document).ready(function() {

    setInterval(function() {
        resetImage();
        checkClimate();
    }, 10000);

    checkClimate();

    $(document).on('click', '.climate-check', function() {
        checkClimate();
    });

    $(document).on('click', '.refresh', function() {
        resetImage();
    });

    function checkClimate() {

        $.get("/climate", function (data) {

            if (data !== "") {
                var climate = JSON.parse(data);
                $('.climate-message').hide();
                $('.climate').show();
                $('.temp').html(climate.temp.toString());
                $('.humidity').html(climate.humidity.toString());
            } else {
                $('.climate').hide();
                $('.climate-message').show();
            }

        });
    }

    function resetImage() {
        var d = new Date();
        $(".live-image").attr("src", "https://s3.amazonaws.com/praxent/officeCurrent.jpg?"+d.getTime());
    }

});
