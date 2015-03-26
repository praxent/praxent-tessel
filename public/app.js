
$(document).ready(function() {

    setInterval(function() {

        var d = new Date();
        console.log('refreshing ', d.getTime());

        $(".live-image").attr("src", "https://s3.amazonaws.com/praxent/officeCurrent.jpg?"+d.getTime());

    }, 10000);

});
