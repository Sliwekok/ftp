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


<div class="modal">
    <div id="background">
        <div class="row">
            <div class="col-6 offset-3 container wrapper" id="rename">
                <div class="row">
                    <div class="col-12">
                        <div class="col-12 modalBody" id="renameForm">
                            <div class="row">
                                <div class="col-12 title">
                                    <div class="col-11"><p>Change file name</p></div>
                                    <div class="col-1 closeButton smallExit" title="Close form"><i class="icon icon-cancel"></i></div>
                                </div>
                            </div>
                            <div class="row">
                                <p class="blockquote-footer"></p>
                                <input type="text" class="textInput" required name="newFilename" id="newFilename">
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
            <div class="col-6 offset-3 container wrapper" id="addDescription">
                <div class="row">
                    <div class="col-12">
                        <div class="col-12 modalBody" id="descriptionForm">
                            <div class="row">
                                <div class="col-12 title">
                                    <div class="col-11"><p>Add file description</p></div>
                                    <div class="col-1 closeButton smallExit" title="Close form"><i class="icon icon-cancel"></i></div>
                                </div>
                            </div>
                            <div class="row">
                                <p class="blockquote-footer"></p>
                                <input type="text" class="textInput" required name="description" id="description" value="">
                                <div class="col-2 offset-7">
                                    <button class="btn btn-outline-secondary closeButton" title="Close uploader">Cancel</button>
                                </div>
                                <div class="col-2">
                                    <button type="submit" class="btn btn-outline-primary submit" title="Rename file">Update</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-6 offset-3 container wrapper" id="addFolderName">
                <div class="row">
                    <div class="col-12">
                        <div class="col-12 modalBody" id="folderNameForm">
                            <div class="row">
                                <div class="col-12 title">
                                    <div class="col-11"><p>Name a directory</p></div>
                                    <div class="col-1 closeButton smallExit" title="Close form"><i class="icon icon-cancel"></i></div>
                                </div>
                            </div>
                            <div class="row">
                                <p class="blockquote-footer"></p>
                                <input type="text" class="textInput" required name="dirName" id="dirName" value="">
                                <div class="col-2 offset-7">
                                    <button class="btn btn-outline-secondary closeButton" title="Close uploader">Cancel</button>
                                </div>
                                <div class="col-2">
                                    <button type="submit" class="btn btn-outline-primary submit" title="Rename file">Create</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-8 offset-2 container wrapper" id="uploadForm">
                <div class="row">
                    <div class="col-12">
                        <form class="col-12" id="uploader" enctype="multipart/form-data">
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
                                {{-- here is input that will be displayed under, but is functional --}}
                                <input id="uploadButton" type="file" name="files[]" multiple required>
                                <div class="row">
                                    <span class="error" id="errorServerName"> @if(isset($errorMessage))<h2>Error occured!</h2> {{$errorMessage}} @endif</span>
                                </div>
                                <div class="row">
                                    <div class="col-12" id="selectGroup">
                                        <div class="col-3 selectFilesButtons" id="addFolder" title="If checked, you can select to upload whole folder with all files within.">
                                        <p><label><i class="icon icon-folder"></i>Add whole folder <span id="checkedBorder"><i id="checkerFolder" class="icon icon-ok"></i></span></label></p>
                                        </div>
                                        <div class="col-3 selectFilesButtons" id="addNextFiles" title="Add next files to upload">
                                            <p><label for="uploadButton"><span><i class="icon icon-doc"></i>Add next files</span></label></p>
                                        </div>
                                        <div class="col-2 offset-2">
                                            <input type="reset" class="btn btn-outline-secondary closeButton" id="cancelUpload" title="Close uploader" value="Cancel">
                                        </div>
                                        <div class="col-2">
                                            <input type="submit" class="btn btn-outline-primary disabled submit" title="Begin uploading" value="Upload">
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-6 offset-3" id="progress">
                                        <p><h2>Wait untill files will fully upload...</h2></p>
                                        <div class="progress">
                                            <div class="progress-bar progress-bar-striped" role="progressbar" style="width: 5%" aria-valuenow="5" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div class="col-6 offset-3 container wrapper" id="moveTo">
                <div class="row">
                    <div class="col-12">
                        <div class="col-12 modalBody">
                            <div class="row">
                                <div class="col-12 title">
                                    <div class="col-11"><p>Move file to ...</p></div>
                                    <div class="col-1 closeButton smallExit" title="Close form"><i class="icon icon-cancel"></i></div>
                                </div>
                            </div>
                            <div class="row">
                                <p class="blockquote-footer"></p>
                                @foreach ($directories as $dir)
                                    <div class="col-4 directoryIconBig" data-url='{{$dir['url']}}'>
                                        <i class="icon icon-folder"></i>
                                        <p>{{$dir['name']}}</p>
                                    </div>
                                @endforeach
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