import * as Assets from './assets.js';
// add grouping files to download zip files
var selectedFiles = new Array();
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
    return
})();

// show div to allow download selected files
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
            $("#zipper").hide(0);
            $("#zipped").show(0);
            $("#zipped a").attr("href", data).click();
            return true;
        }
    });
    return;
})

// on click on dropdown list on file list, activate model to do right action
$(document).on('click', ".openModal", function(){
    var action          = $(this).data('action'),
        fileUrl         = $(this).data('file-url'),
        fileName        = $(this).data('file-name'),
        fileDescription = $(this).data('description');
    switch(action){
        case 'rename':
            openRename(fileName, fileUrl);
            break;
        case 'addDescription':
            openAddDescription(fileName, fileUrl, fileDescription);
            break;
        case 'moveTo':
            openMoveTo(fileName, fileUrl);
            break;
        default:
            break;
    }   
    return;
})

// open description model div
function openAddDescription(fileName, fileUrl, fileDescription){
    const div = $('#addDescription');

    Assets.showModal(div);
    div.find('.blockquote-footer').text(fileName);
    div.find('#description').val(fileDescription);

    $(document).on('click', ".submit", function(){
        $.ajax({
            url: fileUrl,
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            type: 'post',
            data: {newFilename: $('#description').val()},
            error: function(error){
                console.log("=========");
                console.log(error); 
                return false;
            },
            success: function(data){
                Assets.refreshContent("http://ftp.test/app");
                Assets.showAlert(data);
                div.hide(50);
                return true;
            }
        });
    });
    return;
}

// open modal rename 
function openRename(fileName, fileUrl){
    const div = $('#rename');

    Assets.showModal(div);
    div.find('.blockquote-footer').text(fileName);
    div.find('#newFilename').val(fileName);

    $(document).on('click', ".submit", function(){
        $.ajax({
            url: fileUrl,
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            type: 'post',
            data: {newFilename: $('#newFilename').val()},
            error: function(error){
                console.log("=========");
                console.log(error); 
                return false;
            },
            success: function(data){
                Assets.refreshContent("http://ftp.test/app");
                Assets.showAlert(data);
                div.hide(50);
                return true;
            }
        });
    });
    return;
}
// open move to modal box
function openMoveTo(filename, filepath){
    const div = $('#moveTo');
    $(".blockquote-footer").text(filename);

    Assets.showModal(div);

    $(document).on('click', ".directoryIconBig", function(){
        $.ajax({
            url: '/app/moveTo',
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            type: 'post',
            data: {
                oldFilepath: filepath,
                newFilepath: $(this).data('url'),
                filename: filename
            },
            error: function(error){
                console.log("=========");
                console.log(error); 
                return false;
            },
            success: function(data){
                Assets.refreshContent("http://ftp.test/app");
                Assets.forceCloseModal(div);
                return true;
            }
        });
    });
    return;
}
// send prompt when user want to delete file
// variable to check if user has deleted file (prompt)
var previouslyDeleted = false;
$(document).on('click', '.deleteFile', function(){
    var fileUrl = $(this).data("file-url");
    
    // check if user has already deleted some file in session. if not - show prompt
    if(previouslyDeleted === false){
        if(confirm("Are you sure you want to delete that file? There'll be no way back to recover it")) {
            previouslyDeleted = true;    
        } 
        else{
            return;
        }
    }
    // if it is directory, change url to matching route
    if($(this).data("type") == "directory"){
        var url = 'app' + fileUrl + '/deleteDirectory';
    }
    else{
        var url = 'app' + fileUrl + '/delete';
    }
    Assets.deleteFile(url);
    return;
});