// on click reload main div content files to have smooth feeling
$(document).on('click', '.menuItem', function(event){
    var url = $(this).data("destination");

    $.ajax({
        url: url,
        method: 'get',
        error: function(error){
            console.log("=========");
            console.log(error); 
        },
        success: function(){
            $("#app").load(url);
        }

    });

});