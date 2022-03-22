import * as Assets from './assets.js';
// add icon and change css styling when adding whole folder instead of just single files
$(document).on('click', '#addFolder', function(e){
    if($("#checkerFolder").css('visibility') === "visible"){
        $("#uploadButton").removeAttr('webkitdirectory');
        $("#checkerFolder").css("visibility", "hidden");
    }
    else{
        $("#uploadButton").attr('webkitdirectory', '');
        $("#checkerFolder").css("visibility", "visible");
    }
    return;
})

// add fake progress bar to prevent user from leaving 
// it also handles post form submit
$(document).on("submit", '#uploader', function(e){ 
    e.preventDefault();
    
    $("#selectGroup, #uploadedFiles").hide(0);
    $("#progress").show(0);
    var form = new FormData(this);
    $.ajax({
        // it creates upload bar progress
        xhr: function(){
            var xhr = new window.XMLHttpRequest();
            xhr.upload.addEventListener("progress", function(e) {
                if(e.lengthComputable){
                    var percentComplete = Number((e.loaded / e.total) * 100).toFixed(2);
                    $(".progress-bar")
                        .width(percentComplete + '%')
                        .html(percentComplete + '%')
                        .attr({
                            valuenow: percentComplete,
                        });
                }
            }, false);
            return xhr;
        },
        url: "app/upload",
        type: "POST",
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        data: form,
        processData: false,
        contentType: false,
        cache: false,
        error: function(error){
            console.log("=========");
            console.log(error); 
            return false;
        },
        // add fake progress bar to prevent user from leaving
        beforeSend: function(){
            $("#progress").show(0);
            $(".progreess-bar").width("0%");
        },
        success: function(data){
            // clear input field and hide upload form
            $("#selectGroup, #uploadedFiles").show(0);
            $("#progress, #uploadForm").hide(0);
            Assets.refreshContent("http://ftp.test/app");
            Assets.showAlert(data);
            $(".closeButton").click();
            $("#uploadButtonHoveringUpload").show(0);
            var list = $("#listFiles");
            list.html("")
                .hide(0);
            $(".submit").addClass("disabled");
            return true;
        }
    })
});

// change menu on upload files - show some data, change view a bit 
$(document).on('change', "#uploadButton", function(){
    
    let input = document.querySelector('#uploadButton');
    if(input.files.length > 0) {
        // show uploaded files as list
        $("#uploadButtonHoveringUpload").hide(0);
        var list = $("#listFiles");
        list.show(0);
        // go through every file in form
        for(var i = 0; i < input.files.length; i++) {
            var file = input.files[i],
            name = file.name,
            size = Assets.getFixFileSize(file.size);  
            
            // alert("name:" + name + "\n" + size);
            var liContent = "<li class='' data-data-file-id='" + i + "'><span class='fileName'>" + name +  "</span><span class='fileSize'>" + size + "</span></li>";
            list.append(liContent)    
        }
        
        // enable upload button
        $(".submit").removeClass("disabled");
        return
    }
    else{
        $(".submit").addClass("disabled");
        return
    }
    return;
});
// on upload form show some data about the uploaded files
$(document).on('click', '#upload', function(){
    var container = $("#uploadForm");
    Assets.showModal(container);
    return;
});

// on click on reset button reset file upload form
$(document).on('click', "#cancelUpload", function(){
    $("#uploadButton").val('');
    return;
});