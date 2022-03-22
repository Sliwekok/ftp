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

__webpack_require__(/*! ./fileMenagment.js */ "./resources/js/fileMenagment.js");

__webpack_require__(/*! ./assets.js */ "./resources/js/assets.js"); // due to fucked webpack conf laravel gave, all functions are 
// run in global scope.

/***/ }),

/***/ "./resources/js/application.js":
/*!*************************************!*\
  !*** ./resources/js/application.js ***!
  \*************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _assets_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./assets.js */ "./resources/js/assets.js");
 // on click reload main div content to have smooth feeling of updating

$(document).on('click', '.fileAction', function () {
  var url = $(this).data("destination");
  _assets_js__WEBPACK_IMPORTED_MODULE_0__["refreshContent"](url);
  return;
}); // Search box for files

$(document).on("click", '#findButton', function () {
  // hide default nav bar, show input field and focus on it
  $("#menuTop").hide(0);
  $("#searchBox").show(0);
  $("#search").focus(); // on submit send ajax request

  $(document).on("submit", '#searcher', function (e) {
    e.preventDefault();
    var input = $("#search").val();

    if (input.length < 3) {
      return false;
    }

    $.ajax({
      url: "app/search/" + input,
      type: "GET",
      cache: false,
      processData: false,
      error: function error(_error) {
        console.log("=========");
        console.log(_error);
        return false;
      },
      success: function success(data) {
        _assets_js__WEBPACK_IMPORTED_MODULE_0__["refreshContent"]("http://ftp.test/app/search/" + input);
        console.log(data);
        return true;
      }
    });
  });
  $(document).on("click", "#exitSearchForm", function () {
    $("#search").val("");
    $("#menuTop").show(0);
    $("#searchBox").hide(0);
    _assets_js__WEBPACK_IMPORTED_MODULE_0__["refreshContent"]("http://ftp.test/app");
  });
  return;
}); // on click on button to create new directory - open modal and send request

$(document).on("click", "#createDirectory", function () {
  var div = $('#addFolderName'),
      url = "app/createDirectory";
  _assets_js__WEBPACK_IMPORTED_MODULE_0__["showModal"](div); // check if modal is closed, if true, end function to prevent from
  // moving multiple files at once

  if (_assets_js__WEBPACK_IMPORTED_MODULE_0__["isClosed"](div)) return;
  $(document).on('click', ".submit", function () {
    $.ajax({
      url: url,
      headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
      },
      type: 'post',
      data: {
        folderName: $("#dirName").val()
      },
      error: function error(_error2) {
        console.log("=========");
        console.log(_error2);
        return false;
      },
      success: function success(data) {
        _assets_js__WEBPACK_IMPORTED_MODULE_0__["refreshContent"]("http://ftp.test/app");
        div.hide(50);
        div.parents(".modal").hide(50);
        return true;
      }
    });
  });
  return;
}); // on directory click, enter directory storage path

$(document).on('click', ".directoryName", function () {
  var dirPath = $(this).data("file-url"),
      url = "app/showDirectory" + dirPath;
  _assets_js__WEBPACK_IMPORTED_MODULE_0__["refreshContent"](url);
  return;
}); // on click on all files, show main directory storage files

$(document).on("click", ".homeDirectory", function () {
  _assets_js__WEBPACK_IMPORTED_MODULE_0__["refreshContent"]("app");
  return;
});

/***/ }),

/***/ "./resources/js/assets.js":
/*!********************************!*\
  !*** ./resources/js/assets.js ***!
  \********************************/
/*! exports provided: showAlert, refreshContent, getFixFileSize, deleteFile, closeModal, forceCloseModal, showModal, isClosed */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "showAlert", function() { return showAlert; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "refreshContent", function() { return refreshContent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getFixFileSize", function() { return getFixFileSize; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "deleteFile", function() { return deleteFile; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "closeModal", function() { return closeModal; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "forceCloseModal", function() { return forceCloseModal; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "showModal", function() { return showModal; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isClosed", function() { return isClosed; });
// show alert with return message from server
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
        div.removeClass("alert-success alert-danger");
      }, 100);
    } // on click on alert close button


    $(document).on('click', ".btn-close", function () {
      hideMethod();
      return;
    }); // after 10sec hide it automatically

    setTimeout(function () {
      hideMethod();
      return;
    }, 10000);
  })();

  return;
} // via ajax update app div with propably updated content files

function refreshContent(url) {
  $.ajax({
    url: url,
    method: 'get',
    error: function error(_error) {
      console.log("=========");
      console.log(_error);
      return false;
    },
    beforeSend: function beforeSend() {
      $("#appContainer").html("<h1><i class='icon icon-cog'></i></h1>");
    },
    success: function success() {
      $("#appContainer").load(url + " #appContainer");
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
}
function deleteFile(url) {
  ;
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
      return true;
    }
  });
  return;
} // add ways to exit modal
// clicking esc, click outside of modal, click on exit button or on cancel button

function closeModal(container) {
  // on click on exit button leave upload form
  $(document).on('click', '.closeButton', function (e) {
    e.preventDefault();
    forceCloseModal(container);
    return;
  }); // on clicking esc leave upload form

  document.onkeydown = function (e) {
    e = e || window.event;

    if (e.keyCode == 27) {
      forceCloseModal(container);
    }

    return;
  }; // on clicking outside of upload form - exit


  container.mouseup(function (e) {
    if (!$(".wrapper").is(e.target) && $(".wrapper").has(e.target).length === 0) {
      forceCloseModal(container);
    }

    return;
  });
  return;
}
function forceCloseModal(div) {
  div.fadeOut(100).parents(".modal").fadeOut(100);
} // show modal background color and div on call

function showModal(div) {
  // get parent div to show background as in background
  var background = div.parents(".modal");
  background.fadeIn(100); // hide other modals nad show only 1 specified

  div.fadeIn(100).siblings().hide(0);
  closeModal(div);
  return;
} // check if div is visible

function isClosed(div) {
  if (div.is(":hidden")) return true;else return false;
}

/***/ }),

/***/ "./resources/js/fileMenagment.js":
/*!***************************************!*\
  !*** ./resources/js/fileMenagment.js ***!
  \***************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _assets_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./assets.js */ "./resources/js/assets.js");
 // add grouping files to download zip files

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
  return;
})(); // show div to allow download selected files


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
      $("#zipper").hide(0);
      $("#zipped").show(0);
      $("#zipped a").attr("href", data).click();
      return true;
    }
  });
  return;
}); // on click on dropdown list on file list, activate model to do right action

$(document).on('click', ".openModal", function () {
  var action = $(this).data('action'),
      fileUrl = $(this).data('file-url'),
      fileName = $(this).data('file-name'),
      fileDescription = $(this).data('description');

  switch (action) {
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
}); // open description model div

function openAddDescription(fileName, fileUrl, fileDescription) {
  var div = $('#addDescription');
  _assets_js__WEBPACK_IMPORTED_MODULE_0__["showModal"](div);
  div.find('.blockquote-footer').text(fileName);
  div.find('#description').val(fileDescription);
  $(document).on('click', ".submit", function () {
    $.ajax({
      url: fileUrl,
      headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
      },
      type: 'post',
      data: {
        newFilename: $('#description').val()
      },
      error: function error(_error2) {
        console.log("=========");
        console.log(_error2);
        return false;
      },
      success: function success(data) {
        _assets_js__WEBPACK_IMPORTED_MODULE_0__["refreshContent"]("http://ftp.test/app");
        _assets_js__WEBPACK_IMPORTED_MODULE_0__["showAlert"](data);
        div.hide(50);
        return true;
      }
    });
  });
  return;
} // open modal rename 


function openRename(fileName, fileUrl) {
  var div = $('#rename');
  _assets_js__WEBPACK_IMPORTED_MODULE_0__["showModal"](div);
  div.find('.blockquote-footer').text(fileName);
  div.find('#newFilename').val(fileName);
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
        _assets_js__WEBPACK_IMPORTED_MODULE_0__["refreshContent"]("http://ftp.test/app");
        _assets_js__WEBPACK_IMPORTED_MODULE_0__["showAlert"](data);
        div.hide(50);
        return true;
      }
    });
  });
  return;
} // open move to modal box


function openMoveTo(filename, filepath) {
  var div = $('#moveTo');
  $(".blockquote-footer").text(filename);
  _assets_js__WEBPACK_IMPORTED_MODULE_0__["showModal"](div);
  $(document).on('click', ".directoryIconBig", function () {
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
      error: function error(_error4) {
        console.log("=========");
        console.log(_error4);
        return false;
      },
      success: function success(data) {
        _assets_js__WEBPACK_IMPORTED_MODULE_0__["refreshContent"]("http://ftp.test/app");
        _assets_js__WEBPACK_IMPORTED_MODULE_0__["forceCloseModal"](div);
        return true;
      }
    });
  });
  return;
} // send prompt when user want to delete file
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
  } // if it is directory, change url to matching route


  if ($(this).data("type") == "directory") {
    var url = 'app' + fileUrl + '/deleteDirectory';
  } else {
    var url = 'app' + fileUrl + '/delete';
  }

  _assets_js__WEBPACK_IMPORTED_MODULE_0__["deleteFile"](url);
  return;
});

/***/ }),

/***/ "./resources/js/upload.js":
/*!********************************!*\
  !*** ./resources/js/upload.js ***!
  \********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _assets_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./assets.js */ "./resources/js/assets.js");
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
}); // add fake progress bar to prevent user from leaving 
// it also handles post form submit

$(document).on("submit", '#uploader', function (e) {
  e.preventDefault();
  $("#selectGroup, #uploadedFiles").hide(0);
  $("#progress").show(0);
  var form = new FormData(this);
  $.ajax({
    // it creates upload bar progress
    xhr: function xhr() {
      var xhr = new window.XMLHttpRequest();
      xhr.upload.addEventListener("progress", function (e) {
        if (e.lengthComputable) {
          var percentComplete = Number(e.loaded / e.total * 100).toFixed(2);
          $(".progress-bar").width(percentComplete + '%').html(percentComplete + '%').attr({
            valuenow: percentComplete
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
    error: function error(_error) {
      console.log("=========");
      console.log(_error);
      return false;
    },
    // add fake progress bar to prevent user from leaving
    beforeSend: function beforeSend() {
      $("#progress").show(0);
      $(".progreess-bar").width("0%");
    },
    success: function success(data) {
      // clear input field and hide upload form
      $("#selectGroup, #uploadedFiles").show(0);
      $("#progress, #uploadForm").hide(0);
      _assets_js__WEBPACK_IMPORTED_MODULE_0__["refreshContent"]("http://ftp.test/app");
      _assets_js__WEBPACK_IMPORTED_MODULE_0__["showAlert"](data);
      $(".closeButton").click();
      $("#uploadButtonHoveringUpload").show(0);
      var list = $("#listFiles");
      list.html("").hide(0);
      $(".submit").addClass("disabled");
      return true;
    }
  });
}); // change menu on upload files - show some data, change view a bit 

$(document).on('change', "#uploadButton", function () {
  var input = document.querySelector('#uploadButton');

  if (input.files.length > 0) {
    // show uploaded files as list
    $("#uploadButtonHoveringUpload").hide(0);
    var list = $("#listFiles");
    list.show(0); // go through every file in form

    for (var i = 0; i < input.files.length; i++) {
      var file = input.files[i],
          name = file.name,
          size = _assets_js__WEBPACK_IMPORTED_MODULE_0__["getFixFileSize"](file.size); // alert("name:" + name + "\n" + size);

      var liContent = "<li class='' data-data-file-id='" + i + "'><span class='fileName'>" + name + "</span><span class='fileSize'>" + size + "</span></li>";
      list.append(liContent);
    } // enable upload button


    $(".submit").removeClass("disabled");
    return;
  } else {
    $(".submit").addClass("disabled");
    return;
  }

  return;
}); // on upload form show some data about the uploaded files

$(document).on('click', '#upload', function () {
  var container = $("#uploadForm");
  _assets_js__WEBPACK_IMPORTED_MODULE_0__["showModal"](container);
  return;
}); // on click on reset button reset file upload form

$(document).on('click', "#cancelUpload", function () {
  $("#uploadButton").val('');
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