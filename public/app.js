
$(document).ready(function() {

    setInterval(function() {
        resetImage();
    }, 5000);

    $.get("/climate", function (data) {
        var climate = JSON.parse(data);

        $('.temp').html(climate.temp);
        $('.humidity').html(climate.humidity);

        console.log('temp ', climate.temp);
        console.log('humidity ', climate.humidity);
    });

    $(document).on('click', '.refresh', function() {
        console.log('resetting');
        resetImage();
    });

    function resetImage() {
        var d = new Date();
        $(".live-image").attr("src", "https://s3.amazonaws.com/praxent/officeCurrent.jpg?"+d.getTime());
    }

});
