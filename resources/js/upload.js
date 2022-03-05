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
    return;
})

// add fake progress bar to prevent user from leaving 
$(document).on("submit", '#uploadedFiles', function(){ 
    
});