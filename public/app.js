
$(document).ready(function() {

    setInterval(function() {
        resetImage();
    }, 5000);

    checkClimate();

    $(document).on('click', '.climate-check', function() {
        console.log('checking');
        checkClimate();
    });

    $(document).on('click', '.refresh', function() {
        resetImage();
    });

    function checkClimate() {

        $.get("/climate", function (data) {
            var climate = JSON.parse(data);

            console.log('climate', climate);
            if (climate) {
                $('.climate-message').hide();
                $('.temp').html(climate.temp);
                $('.humidity').html(climate.humidity);
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
