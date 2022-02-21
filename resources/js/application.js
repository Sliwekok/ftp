// on click reload main div content files to have smooth feeling
$(document).on('click', '.fileAction', function(){
    var url = $(this).data("destination");
    refreshContent(url);
    fixSizeOfFiles();
});

// via ajax update app div with propably updated content files
function refreshContent(url, parent, calledDiv){
    calledDiv = (typeof calledDiv === 'undefined') ? '' : calledDiv;
    $.ajax({
        url: url,
        method: 'get',
        error: function(error){
            console.log("=========");
            console.log(error); 
            return false;
        },
        success: function(){
            $(parent).load(url+calledDiv);
            return true;
        }
    });
}



// show size in KB, MB or GB
function getFixFileSize(size){
    var sizes = ["B", "KB", "MB", "GB"],
    count = 0;    
    if(size > 1024) var newSize = roundSize(size);
    
    function roundSize(size){
        count++
        // round to 2 decimals after coma
        size = Number(size / 1024).toFixed(2);
        if(size > 1024) var size = roundSize(size)
        return size;
    }
    
    return newSize + sizes[count];
}
// on ready, fix size of files to correct measure
(function fixSizeOfFiles(){
    $(document).ready(function(){
        $(".userFile").each(function () {
            var size = $(this).find('.fileSize').text(),
            fixed = getFixFileSize(size);
            $(this).find('.fileSize').html(fixed);
        });
    })
})();

// show alert with return message from server
function showAlert(data){
    var state    = data['status'],
        msg      = data['message'],
        header   = data['header'],
        className= (state == 'error') ? "danger" : "success";
    
    $(".alert").addClass('alert-'+className).fadeIn(50);
    $("#alertHeader").text(header);
    $("#alertContent").text(msg);
    
    // hide alert by hand, because by default, it's getting deleted
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
            return;
        });
        
        // after 15sec hide it automatically
        setTimeout(function(){
            hideMethod();
            return;
        }, 15000)
        
    })();
    
}

/* 
 *  This file menages upload form 
 */
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
})

// on upload form show some data about the uploaded files
$(document).on('click', '#upload', function(){
    var container = $("#uploadForm");
    container.fadeIn(100)
    // on click on exit button leave upload form
    $(document).on('click', '.closeButton', function(e){
        e.preventDefault();
        container.fadeOut(100);
    });
    // on clicking esc leave upload form
    document.onkeydown = function(e) {
        e = e || window.event;
        if(e.keyCode == 27)  container.fadeOut(100);
        
    }
    // on clicking outside of upload form - exit
    container.mouseup(function(e){
        if(!$("#wrapper").is(e.target) && $("#wrapper").has(e.target).length === 0){
            container.fadeOut(100);
        }
    });
    
});

// change menu on upload files - show some data, change view a bit 
$(document).on('change', "#uploadButton", function(){
    const input = document.querySelector('#uploadButton');
    $(document).ready(function(){
        if(input.files.length > 0) {
            $("#uploadButtonHoveringUpload").hide(0);
            var list = $("#listFiles");
            list.show(0);
            
            for (var i = 0; i < input.files.length; i++) {
                var file = input.files[i],
                    name = file.name,
                    size = getFixFileSize(file.size);  

                // alert("name:" + name + "\n" + size);
                var liContent = "<li class='' data-data-file-id='" + i + "'><span class='fileName'>" + name +  "</span><span class='fileSize'>" + size + "</span></li>";
                list.append(liContent)    
            }

            // enable upload button
            $("#submit").removeClass("disabled");

        }
        else{
            $("#submit").addClass("disabled");
        }
    });

});

// remove file from upload form 
$(document).on("click",".removeFile", function(e){
    var fileId = $(this).parent().data("file-id"),
        files  = document.querySelector('#uploadButton').files,
        file = files[fileId];

        for(var i = 0; i < files.length; i++){
            if(files[i].name === file.name){
                files[i] = '';
                $(this).parent().remove();
                break;
            }
        }
})

// on setting click fill dropdown name data 
$(document).on('click', '.options', function(){
    var fileName = $(this).data("file-name");
    $(".dropdownFileName").text(fileName);
})

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
    deleteFile(fileUrl);
    
});

// FILE MENAGMENT


function deleteFile(file){
    var url = '/app/file' + file + '/delete';
    $.ajax({
        url: url,
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        method: 'DELETE',
        error: function(error){
            console.log("=========");
            console.log(error); 
            return false;
        },
        success: function(data){
            refreshContent("http://ftp.test/app", "#appContainer", " #appContainer");
            showAlert(data);
            fixSizeOfFiles();
            return true;
        }
    });
}