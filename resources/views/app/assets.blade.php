<div class="alert col-6 offset-3 fade show" role="alert">
    <div class="row">
        <div class="col-10">
            <h4 class="alert-heading" id="alertHeader"></h4>
        </div>
        <div class="col-1 offset-1">
            <button type="button" class="btn-close" aria-label="Close"></button>
        </div>
    </div>
    <div class="row">
        <p class="mb-0" id="alertContent"></p>
    </div>
</div>
<div class="modal" id="rename">
    <div id="background">
        <div class="row">
            <div class="col-6 offset-3 container wrapper" id="rename">
                <div class="row">
                    <div class="col-12">
                        <div class="col-12 modalBody" id="renameForm">
                            <div class="row">
                                <div class="col-12 title">
                                    <div class="col-11"><p>Change file name</p></div>
                                    <div class="col-1 closeButton smallExit" title="Close uploader"><i class="icon icon-cancel"></i></div>
                                </div>
                            </div>
                            <div class="row">
                                <p class="blockquote-footer"></p>
                                <input type="text" required name="newFilename" id="newFilename">
                                <div class="col-2 offset-7">
                                    <button class="btn btn-outline-secondary closeButton" title="Close uploader">Cancel</button>
                                </div>
                                <div class="col-2">
                                    <button type="submit" class="btn btn-outline-primary submit" title="Rename file">Rename</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div id="downloadButton" title="Download selected files">
    <p id="zipper"><span>Download <span id="countSelectedFiles"></span> files</span><i class="icon icon-download"></i></p>
    <p id="zipped"><span>Download started! If not - click <a href="" download target="_blank">here</a></span></p>
</div>