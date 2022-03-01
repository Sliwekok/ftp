/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./resources/js/app.js":
/*!*****************************!*\
  !*** ./resources/js/app.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./application.js */ "./resources/js/application.js");

__webpack_require__(/*! ./upload.js */ "./resources/js/upload.js");

__webpack_require__(/*! ./fileMenagment */ "./resources/js/fileMenagment.js"); // due to fucked webpack conf laravel gave, all functions are 
// run in global scope.

/***/ }),

/***/ "./resources/js/application.js":
/*!*************************************!*\
  !*** ./resources/js/application.js ***!
  \*************************************/
/*! exports provided: refreshContent, getFixFileSize, fixSizeOfFiles, showAlert, closeModal, deleteFile, openRename */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "refreshContent", function() { return refreshContent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getFixFileSize", function() { return getFixFileSize; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fixSizeOfFiles", function() { return fixSizeOfFiles; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "showAlert", function() { return showAlert; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "closeModal", function() { return closeModal; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "deleteFile", function() { return deleteFile; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "openRename", function() { return openRename; });
// on click reload main div content files to have smooth feeling
$(document).on('click', '.fileAction', function () {
  var url = $(this).data("destination");
  refreshContent(url);
  fixSizeOfFiles();
  return;
}); // via ajax update app div with propably updated content files

function refreshContent(url, parent, calledDiv) {
  calledDiv = typeof calledDiv === 'undefined' ? '' : calledDiv;
  $.ajax({
    url: url,
    method: 'get',
    error: function error(_error) {
      console.log("=========");
      console.log(_error);
      return false;
    },
    success: function success() {
      $(parent).load(url + calledDiv);
      return true;
    }
  });
} // show size in KB, MB or GB

function getFixFileSize(size) {
  var sizes = ["B", "KB", "MB", "GB"],
      count = 0;
  if (size > 1024) var newSize = roundSize(size);

  function roundSize(size) {
    count++; // round to 2 decimals after coma

    size = Number(size / 1024).toFixed(2);
    if (size > 1024) var size = roundSize(size);
    return size;
  }

  return newSize + sizes[count];
} // on ready, fix size of files to correct measure

function fixSizeOfFiles() {
  $(".userFile").each(function () {
    var size = $(this).find('.fileSize').text(),
        fixed = getFixFileSize(size);
    $(this).find('.fileSize').html(fixed);
  });
  return;
}
;
fixSizeOfFiles(); // show alert with return message from server

function showAlert(data) {
  var state = data['status'],
      msg = data['message'],
      header = data['header'],
      className = state == 'error' ? "danger" : "success";
  $(".alert").addClass('alert-' + className).fadeIn(50);
  $("#alertHeader").text(header);
  $("#alertContent").text(msg); // hide alert by hand, because by default (bootstrap), it's getting deleted

  (function () {
    var div = $(".alert");

    function hideMethod() {
      div.fadeOut(100);
      setTimeout(function () {
        if (div.hasClass("alert-success")) div.removeClass("alert-success");
        if (div.hasClass("alert-danger")) div.removeClass("alert-danger");
      }, 100);
    } // on click on alert close button


    $(document).on('click', ".btn-close", function () {
      hideMethod(); // location.reload();

      return;
    }); // after 15sec hide it automatically

    setTimeout(function () {
      hideMethod(); // location.reload();

      return;
    }, 15000);
  })();

  return;
} // add ways to exit modal
// clicking esc, click outside of modal, click on exit button or on cancel button

function closeModal(container) {
  // on click on exit button leave upload form
  $(document).on('click', '.closeButton', function (e) {
    e.preventDefault();
    container.fadeOut(100);
    return;
  }); // on clicking esc leave upload form

  document.onkeydown = function (e) {
    e = e || window.event;
    if (e.keyCode == 27) container.fadeOut(100);
    return;
  }; // on clicking outside of upload form - exit


  container.mouseup(function (e) {
    if (!$(".wrapper").is(e.target) && $(".wrapper").has(e.target).length === 0) {
      container.fadeOut(100);
      return;
    }
  });
} // on upload form show some data about the uploaded files

$(document).on('click', '#upload', function () {
  var container = $("#uploadForm");
  container.fadeIn(100);
  closeModal(container);
  return;
}); // on setting click fill dropdown name data 

$(document).on('click', '.options', function () {
  var fileName = $(this).data("file-name");
  $(".dropdownFileName").text(fileName);
  return;
}); // send prompt when user want to delete file
// variable to check if user has deleted file (prompt)

var previouslyDeleted = false;
$(document).on('click', '.deleteFile', function () {
  var fileUrl = $(this).data("file-url"); // check if user has already deleted some file in session. if not - show prompt

  if (previouslyDeleted === false) {
    if (confirm("Are you sure you want to delete that file? There'll be no way back to recover it")) {
      previouslyDeleted = true;
    } else {
      return;
    }
  }

  deleteFile(fileUrl);
  return;
}); // FILE MENAGMENT

function deleteFile(file) {
  var url = '/app/file' + file + '/delete';
  $.ajax({
    url: url,
    headers: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    },
    method: 'DELETE',
    error: function error(_error2) {
      console.log("=========");
      console.log(_error2);
      return false;
    },
    success: function success(data) {
      refreshContent("http://ftp.test/app", "#appContainer", " #appContainer");
      showAlert(data);
      fixSizeOfFiles();
      return true;
    }
  });
} // on click on dropdown list on file list, activate model to do right action

$(document).on('click', ".openModal", function () {
  var action = $(this).data('action'),
      fileUrl = $(this).data('file-url'),
      fileName = $(this).data('file-name');
  fileUrl = 'app/file' + fileUrl + "/rename";

  switch (action) {
    case 'rename':
      openRename(fileName, fileUrl);
      break;

    case 'moveFile':
      openMoveFile(fileName, fileUrl);
      break;

    case 'addDescription':
      openAddDescription(fileName, fileUrl);
      break;

    default:
      break;
  }

  return;
}); // open modal rename 

function openRename(fileName, fileUrl) {
  var div = $('#rename');
  div.fadeIn(100);
  div.find('.blockquote-footer').text(fileName);
  div.find('#newFilename').val(fileName);
  closeModal(div);
  $(document).on('click', ".submit", function () {
    $.ajax({
      url: fileUrl,
      headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
      },
      type: 'post',
      data: {
        newFilename: $('#newFilename').val()
      },
      error: function error(_error3) {
        console.log("=========");
        console.log(_error3);
        return false;
      },
      success: function success(data) {
        refreshContent("http://ftp.test/app", "#appContainer", " #appContainer");
        showAlert(data);
        fixSizeOfFiles();
        div.hide(50);
        return true;
      }
    });
  });
  return;
} // change menu on upload files - show some data, change view a bit 

$(document).on('change', "#uploadButton", function () {
  var input = document.querySelector('#uploadButton');
  $(document).ready(function () {
    if (input.files.length > 0) {
      $("#uploadButtonHoveringUpload").hide(0);
      var list = $("#listFiles");
      list.show(0);

      for (var i = 0; i < input.files.length; i++) {
        var file = input.files[i],
            name = file.name,
            size = getFixFileSize(file.size); // alert("name:" + name + "\n" + size);

        var liContent = "<li class='' data-data-file-id='" + i + "'><span class='fileName'>" + name + "</span><span class='fileSize'>" + size + "</span></li>";
        list.append(liContent);
      } // enable upload button


      $(".submit").removeClass("disabled");
      return;
    } else {
      $(".submit").addClass("disabled");
      return;
    }
  });
  return;
});

/***/ }),

/***/ "./resources/js/fileMenagment.js":
/*!***************************************!*\
  !*** ./resources/js/fileMenagment.js ***!
  \***************************************/
/*! exports provided: showAlert */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "showAlert", function() { return showAlert; });
// add grouping files to download
var selectedFiles = new Array();

(function () {
  var checkEnabled = false; // on clicking ctrl enable grouping on holding ctrl

  $(document).on("keydown", function (e) {
    if (checkEnabled === true) return;
    e = e || window.event;

    if (e.keyCode == 17) {
      checkEnabled = true;
    }
  }); // disable grouping when not holding ctrl

  $(document).on("keyup", function (e) {
    e = e || window.event;

    if (e.keyCode == 17) {
      checkEnabled = false;
    }
  }); // destroy all selected files on clicking esc

  $(document).on("keydown", function (e) {
    e = e || window.event;

    if (e.keyCode == 27) {
      selectedFiles.length = 0;
      $('.userFile').removeClass('selected');
      $("#downloadButton").hide(0);
    }
  }); // on click add class and add selected files to array

  $(document).on('click', '.userFile', function (e) {
    // add to file data (url and name) to array
    if (checkEnabled === true) {
      var fileUrl = $(this).data('file-url'),
          fileName = $(this).data('file-name');

      if (!$(this).hasClass('selected')) {
        $(this).addClass('selected');
        var temp = new Array(fileUrl, fileName);
        selectedFiles.push(temp);
      } else {
        $(this).removeClass("selected"); // delete from array

        for (var i = 0; i < selectedFiles.length; i++) {
          // check if both data are the same
          if (selectedFiles[i][0] == fileUrl && selectedFiles[i][1] == fileName) {
            selectedFiles.splice(i, 1);
          }
        }
      }
    } // if has some data - show div to download zip
    // css function doesn't work, because in CSS is !important given 


    if (selectedFiles.length > 0) {
      $("#downloadButton").attr("style", "display: flex !important");
      $("#zipper").show(0);
      $("#zipped").hide(0);
      $("#countSelectedFiles").text(selectedFiles.length);
    } else {
      $("#downloadButton").attr("style", "display: none !important");
    }
  });
})(); // show div to allow donwload selected files


$(document).on("click", "#zipper", function () {
  $.ajax({
    url: '/app/downloadZip',
    method: 'get',
    data: {
      files: selectedFiles
    },
    error: function error(_error) {
      console.log("=========");
      console.log(_error);
      return false;
    },
    success: function success(data) {
      if (data instanceof Array) {
        showAlert(data);
        console.log(data);
      } else {
        $("#zipper").hide(0);
        $("#zipped").show(0);
        $("#zipped a").attr("href", data).click();
      }

      return true;
    }
  });
  return;
}); // it's the same function as in application.js, but because of some weird webpack modules, it's not global

function showAlert(data) {
  var state = data['status'],
      msg = data['message'],
      header = data['header'],
      className = state == 'error' ? "danger" : "success";
  $(".alert").addClass('alert-' + className).fadeIn(50);
  $("#alertHeader").text(header);
  $("#alertContent").text(msg); // hide alert by hand, because by default (bootstrap), it's getting deleted

  (function () {
    var div = $(".alert");

    function hideMethod() {
      div.fadeOut(100);
      setTimeout(function () {
        if (div.hasClass("alert-success")) div.removeClass("alert-success");
        if (div.hasClass("alert-danger")) div.removeClass("alert-danger");
      }, 100);
    } // on click on alert close button


    $(document).on('click', ".btn-close", function () {
      hideMethod(); // location.reload();

      return;
    }); // after 15sec hide it automatically

    setTimeout(function () {
      hideMethod(); // location.reload();

      return;
    }, 15000);
  })();

  return;
}

/***/ }),

/***/ "./resources/js/upload.js":
/*!********************************!*\
  !*** ./resources/js/upload.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* 
 *  This file menages upload form 
 */
// add icon and change css styling when adding whole folder instead of just single files
$(document).on('click', '#addFolder', function (e) {
  if ($("#checkerFolder").css('visibility') === "visible") {
    $("#uploadButton").removeAttr('webkitdirectory');
    $("#checkerFolder").css("visibility", "hidden");
  } else {
    $("#uploadButton").attr('webkitdirectory', '');
    $("#checkerFolder").css("visibility", "visible");
  }

  return;
});

/***/ }),

/***/ "./resources/sass/app.scss":
/*!*********************************!*\
  !*** ./resources/sass/app.scss ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 0:
/*!*************************************************************!*\
  !*** multi ./resources/js/app.js ./resources/sass/app.scss ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! C:\Programy\Laragon\laragon\www\ftp\resources\js\app.js */"./resources/js/app.js");
module.exports = __webpack_require__(/*! C:\Programy\Laragon\laragon\www\ftp\resources\sass\app.scss */"./resources/sass/app.scss");


/***/ })

/******/ });