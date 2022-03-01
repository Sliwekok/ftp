<div class="modal" id="uploadForm">
    <div class="row">
        <div id="background">
            <div class="row">
                <div class="col-8 offset-2 container wrapper">
                    <div class="row">
                        <div class="col-12">
                            <form class="col-12" id="uploader" method="post" action="{{url('app/upload')}}" enctype="multipart/form-data">
                                @csrf
                                <div class="row">
                                    <div class="col-12 title">
                                        <div class="col-11"><p>Select files to Upload</p></div>
                                        <div class="col-1 closeButton smallExit" title="Close uploader"><i class="icon icon-cancel"></i></div>
                                    </div>
                                </div>
                                <div class="row">
                                    {{-- here is div that will be displayed instead of default boring field --}}
                                    <div class="col-12" id="uploadedFiles">
                                        <label class="labelFiles" for="uploadButton" id="uploadButtonHoveringUpload"><div id="boxShaped"><i class="icon icon-plus"></i></div></label>
                                        <ul class="col-12" id="listFiles"></ul>
                                    </div>
                                    {{-- here is input that will be displayed under, but working (theoretically) --}}
                                    <input id="uploadButton" type="file" name="files[]" multiple required>
                                    <div class="row">
                                        <div class="col-12" id="selectGroup">
                                            <div class="col-3 selectFilesButtons" id="addFolder" title="If checked, you can select to upload whole folder with all files within.">
                                            <p><label><i class="icon icon-folder"></i>Add whole folder <span id="checkedBorder"><i id="checkerFolder" class="icon icon-ok"></i></span></label></p>
                                            </div>
                                            <div class="col-3 selectFilesButtons" title="Add next files to upload">
                                                <p><label for="uploadButton"><span><i class="icon icon-doc"></i>Add next files</span></label></p>
                                            </div>
                                            <div class="col-2 offset-2">
                                                <button class="btn btn-outline-secondary closeButton" title="Close uploader">Cancel</button>
                                            </div>
                                            <div class="col-2">
                                                <input type="submit" class="btn btn-outline-primary disabled submit" title="Begin uploading" value="Upload">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>