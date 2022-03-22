import * as Assets from './assets.js';
// on click reload main div content to have smooth feeling of updating
$(document).on('click', '.fileAction', function(){
    var url = $(this).data("destination");
    Assets.refreshContent(url);
    return;
});

// Search box for files
$(document).on("click", '#findButton', function(){ 
    // hide default nav bar, show input field and focus on it
    $("#menuTop").hide(0);
    $("#searchBox").show(0);
    $("#search").focus();
    
    // on submit send ajax request
    $(document).on("submit", '#searcher', function(e){
        e.preventDefault();
        var input = $("#search").val();
        if(input.length < 3){
            return false;
        }
        $.ajax({
            url: "app/search/" + input,
            type: "GET",
            cache : false,
            processData: false,
            error: function(error){
                console.log("=========");
                console.log(error); 
                return false;
            },
            success: function(data){
                Assets.refreshContent("http://ftp.test/app/search/" + input);
                console.log(data);
                return true;
            }
        });
    });

    $(document).on("click", "#exitSearchForm", function(){
        $("#search").val("");
        $("#menuTop").show(0);
        $("#searchBox").hide(0);
        Assets.refreshContent("http://ftp.test/app");
    })
    return;

});

// on click on button to create new directory - open modal and send request
$(document).on("click", "#createDirectory", function(){
    var div = $('#addFolderName'),
        url = "app/createDirectory";
        
    Assets.showModal(div);
    // check if modal is closed, if true, end function to prevent from
    // moving multiple files at once
    if(Assets.isClosed(div)) return;
    $(document).on('click', ".submit", function(){
        $.ajax({
            url: url,
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            type: 'post',
            data: {folderName: $("#dirName").val()},
            error: function(error){
                console.log("=========");
                console.log(error); 
                return false;
            },
            success: function(data){
                Assets.refreshContent("http://ftp.test/app");
                div.hide(50);
                div.parents(".modal").hide(50);
                return true;
            }
        });
    });

    return;
})

// on directory click, enter directory storage path
$(document).on('click', ".directoryName", function(){
    var dirPath = $(this).data("file-url"),
        url = "app/showDirectory" + dirPath;

    Assets.refreshContent(url);
    return;
});

// on click on all files, show main directory storage files
$(document).on("click", ".homeDirectory", function(){
    Assets.refreshContent("app");
    return;
})