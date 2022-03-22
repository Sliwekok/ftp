@extends('app.layout')

@section('content')
<div id="files">
    @if($files == 0)
        <div class="row">
            <div class="col-12">
                <p>You have no files, yet</p>
            </div>
        </div>
    @else
        <div class="row">
            <div class="col-12" id="appContainer">
                <div id="directories">
                    <div clas="row">
                        <div class="row"><p><i class="icon icon-folder"></i>Folders</p></div>
                        @foreach($directories as $directory)
                            <div class="row enterDirectory">
                                <span class="directoryName directorySpan" data-file-url="{{$directory['url']}}">{{$directory['name']}}</span>
                                <span class="action options dropdown-toggle directorySpan" data-bs-toggle="dropdown" aria-expanded="false" title="Additional options for file"><i class="icon icon-dot-3"></i></span>
                                <ul class="dropdown-menu col-4">
                                    <li><span class="dropdown-item dropdownFileName">{{$directory['name']}}</span></li>
                                    <li><hr class="dropdown-divider"></li>
                                    <li><span class="dropdown-item" data-file-name="{{$directory['name']}}" data-file-url="{{$directory['url']}}">Share</span></li>
                                    <li><hr class="dropdown-divider"></li>
                                    <li><span class="dropdown-item openModal" data-file-name="{{$directory['name']}}" data-action="rename" data-file-url="{{$directory['url']}}">Rename</span></li>
                                    <li><span class="dropdown-item openModal" data-file-name="{{$directory['name']}}" data-action="moveTo" data-file-url="{{$directory['url']}}">Move To</span></li>
                                    <li><span class="dropdown-item deleteFile" data-type="directory" data-file-url="{{$directory['url']}}">Delete</span></li>
                                </ul>
                            </div>
                        @endforeach
                        <div class="row enterDirectory">
                            <div class="col-12">
                                <button id="createDirectory" class="btn btn-primary openModal" data-dirName="createDirectory">Create new</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="listedFiles">
                    <div clas="row"><div class="col-12">
                        <p class="homeDirectory enteredDirectory"><i class="icon icon-home"></i>All files</p>
                        @if(isset($path))
                        <span> > </span>
                        @endif
                    </div></div>
                    @foreach($files as $file)
                        <div class="row">
                            <div class="col-12 userFile" data-file-name="{{$file['name']}}" data-file-url="{{$file['url']}}">
                                <div class="col-9 data">
                                    <a href="{{$file['url']}}" target="_blank">
                                        @if($file['isPicture'] === true)
                                            <img class="smallPreview" alt="User uploaded file" src="{{$file['url']}}">
                                        @else
                                            <i class="icon icon-doc"></i>
                                        @endif
                                        <span>{{$file['name']}}</span>
                                    </a>
                                    <span class="fileSize">{{$file['size']}}</span>
                                </div>
                                <div class="col-3 fileMenagment">
                                    <span class="share action" title="Share file URL"><i class="icon icon-share-squared"></i></span>
                                    <span class="action deleteFile" data-file-url="{{$file['url']}}" title="Delete file"><i class="icon icon-cancel"></i></span>
                                    <span class="date" title="Upload/Update time">{{$file['lastMod']}}</span>
                                    <span class="action options dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" title="Additional options for file"><i class="icon icon-dot-3"></i></span>
                                    <ul class="dropdown-menu">
                                        <li><span class="dropdown-item dropdownFileName">{{$file['name']}}</span></li>
                                        <li><hr class="dropdown-divider"></li>
                                        <li><span class="dropdown-item" data-file-name="{{$file['name']}}" data-file-url="{{$file['url']}}">Share</span></li>
                                        <li><a download href="{{$file['url']}}"><span class="dropdown-item">Download</span></a></li>
                                        <li><hr class="dropdown-divider"></li>
                                        <li><span class="dropdown-item openModal" data-file-name="{{$file['name']}}" data-action="rename" data-file-url="{{$file['url']}}">Rename</span></li>
                                        <li><span class="dropdown-item openModal" data-file-name="{{$file['name']}}" data-action="moveTo" data-file-url="{{$file['url']}}">Move To</span></li>
                                        <li><span class="dropdown-item openModal" data-file-name="{{$file['name']}}" data-action="addDescription" data-file-url="{{$file['url']}}" data-description="{{$file['description']}}">Description</span></li>
                                        <li><span class="dropdown-item deleteFile" data-file-url="{{$file['url']}}">Delete</span></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>
        </div>
    @endif
</div>
    
@endsection