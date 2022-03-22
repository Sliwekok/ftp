// show alert with return message from server
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
                div.removeClass("alert-success alert-danger");
            }, 100);
        }
        
        // on click on alert close button
        $(document).on('click', ".btn-close", function(){
            hideMethod();
            return;
        });
        
        // after 10sec hide it automatically
        setTimeout(function(){
            hideMethod();
            return;
        }, 10000)
        
    })();
    return;
}

// via ajax update app div with propably updated content files
export function refreshContent(url){
    $.ajax({
        url: url,
        method: 'get',
        error: function(error){
            console.log("=========");
            console.log(error); 
            return false;
        },
        beforeSend: function(){
            $("#appContainer").html("<h1><i class='icon icon-cog'></i></h1>");
        },
        success: function(){
            $("#appContainer").load(url+" #appContainer");
            return true;
        }
    });
}

// show size in KB, MB or GB
export function getFixFileSize(size){
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

export function deleteFile(url){;
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
            return true;
        }
    });
    return;
}

// add ways to exit modal
// clicking esc, click outside of modal, click on exit button or on cancel button
export function closeModal(container){
    // on click on exit button leave upload form
    $(document).on('click', '.closeButton', function(e){
        e.preventDefault();
        forceCloseModal(container);
        return;
    });
    // on clicking esc leave upload form
    document.onkeydown = function(e) {
        e = e || window.event;
        if(e.keyCode == 27){
            forceCloseModal(container);
        }
        return;
    }
    // on clicking outside of upload form - exit
    container.mouseup(function(e){
        if(!$(".wrapper").is(e.target) && $(".wrapper").has(e.target).length === 0){
            forceCloseModal(container);
        }
        return;
    });
    return;
}
export function forceCloseModal(div){
    div.fadeOut(100)
        .parents(".modal").fadeOut(100);
}
// show modal background color and div on call
export function showModal(div){
    // get parent div to show background as in background
    var background = div.parents(".modal");
    background.fadeIn(100);
    // hide other modals nad show only 1 specified
    div.fadeIn(100)
        .siblings().hide(0);
    closeModal(div);
    return;
}

// check if div is visible
export function isClosed(div){
    if(div.is(":hidden")) return true;
    else return false;
}
