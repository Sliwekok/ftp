
// add grouping files to download
var selectedFiles= new Array();
(function(){
    var checkEnabled = false;

    // on clicking ctrl enable grouping on holding ctrl
    $(document).on("keydown", function(e){
        if(checkEnabled === true) return;
        e = e || window.event;
        if(e.keyCode == 17){
            checkEnabled = true;
        }
    });

    // disable grouping when not holding ctrl
    $(document).on("keyup", function(e){
        e = e || window.event;
        if(e.keyCode == 17){
            checkEnabled = false;
        }
    })

    // destroy all selected files on clicking esc
    $(document).on("keydown", function(e){
        e = e || window.event;
        if(e.keyCode == 27){
            selectedFiles.length = 0;
            $('.userFile').removeClass('selected');
            $("#downloadButton").hide(0);
        }
    });

    // on click add class and add selected files to array
    $(document).on('click', '.userFile', function(e){
        // add to file data (url and name) to array
        if(checkEnabled === true){
            var fileUrl = $(this).data('file-url'),
                fileName = $(this).data('file-name');
            if(!$(this).hasClass('selected')){
                $(this).addClass('selected');
                var temp = new Array(fileUrl, fileName);
                selectedFiles.push(temp);
            }
            else{
                $(this).removeClass("selected");
                // delete from array
                for(var i = 0; i < selectedFiles.length; i++){
                    // check if both data are the same
                    if(selectedFiles[i][0] == fileUrl && selectedFiles[i][1] == fileName){
                        selectedFiles.splice(i, 1);
                    }
                }
            }
        }
        // if has some data - show div to download zip
        // css function doesn't work, because in CSS is !important given 
        if(selectedFiles.length > 0){
            $("#downloadButton").attr("style", "display: flex !important");
            $("#zipper").show(0);
            $("#zipped").hide(0);
            $("#countSelectedFiles").text(selectedFiles.length);
        }
        else{
            $("#downloadButton").attr("style", "display: none !important");
        }
    });
})();

// show div to allow donwload selected files
$(document).on("click", "#zipper", function(){
    $.ajax({
        url: '/app/downloadZip',
        method: 'get',
        data: {files: selectedFiles},
        error: function(error){
            console.log("=========");
            console.log(error); 
            return false;
        },
        success: function(data){
            if(data instanceof Array){
                showAlert(data);
                console.log(data);
            }
            else{
                $("#zipper").hide(0);
                $("#zipped").show(0);
                $("#zipped a").attr("href", data).click();
            }
            return true;
        }
    });
    return;
})

// it's the same function as in application.js, but because of some weird webpack modules, it's not global
export function showAlert(data){
    var state    = data['status'],
        msg      = data['message'],
        header   = data['header'],
        className= (state == 'error') ? "danger" : "success";

    $(".alert").addClass('alert-'+className).fadeIn(50);
    $("#alertHeader").text(header);
    $("#alertContent").text(msg);
    
    // hide alert by hand, because by default (bootstrap), it's getting deleted
    (() => {
        var div = $(".alert");
        
        function hideMethod(){
            div.fadeOut(100);
            setTimeout(function(){
                if(div.hasClass("alert-success")) div.removeClass("alert-success");
                if(div.hasClass("alert-danger")) div.removeClass("alert-danger");
            }, 100);
        }
        
        // on click on alert close button
        $(document).on('click', ".btn-close", function(){
            hideMethod();
            // location.reload();
            return;
        });
        
        // after 15sec hide it automatically
        setTimeout(function(){
            hideMethod();
            // location.reload();
            return;
        }, 15000)
        
    })();
    return;
}