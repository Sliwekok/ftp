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
                    <div clas="row"><div class="col-12"><p><i class="icon icon-folder"></i>Folders</p></div></div>
                </div>
                <div id="listedFiles">
                    <div clas="row"><div class="col-12"><p><i class="icon icon-home"></i>All files</p></div></div>
                    @foreach($files as $file)
                        <div class="row">
                            <div class="col-12 userFile">
                                <div class="col-9 data">
                                    <a href="{{$file['url']}}" target="_blank"><img class="smallPreview" alt="User uploaded file" src="{{$file['url']}}">
                                    <span>{{$file['name']}}</span></a>
                                    <span class="fileSize">{{$file['size']}}</span>
                                </div>
                                <div class="col-3 fileMenagment">
                                    <span class="share action" title="Share file URL"><i class="icon icon-share-squared"></i></span>
                                    <span class="action deleteFile" data-file-url="{{$file['url']}}" title="Delete file"><i class="icon icon-cancel"></i></span>
                                    <span class="date" title="Upload/Update time">{{$file['lastMod']}}</span>
                                    <span class="action options dropdown-toggle" data-file-name="{{$file['name']}}" data-bs-toggle="dropdown" aria-expanded="false" title="Additional options for file"><i class="icon icon-dot-3"></i></span>
                                    <ul class="dropdown-menu">
                                        <li><span class="dropdown-item dropdownFileName"></span></li>
                                        <li><hr class="dropdown-divider"></li>
                                        <li><span class="dropdown-item copy" data-file="{{$file['name']}}">Copy link</span></li>
                                        <li><span class="dropdown-item" data-file="{{$file['name']}}">Share</span></li>
                                        <li><span class="dropdown-item" data-file="{{$file['name']}}">Download</span></li>
                                        <li><hr class="dropdown-divider"></li>
                                        <li><span class="dropdown-item" data-function-call="renameFile" data-file="{{$file['name']}}">Rename</span></li>
                                        <li><span class="dropdown-item" data-function-call="moveFile" data-file="{{$file['name']}}">Move To</span></li>
                                        <li><span class="dropdown-item" data-function-call="addDescription" data-file="{{$file['name']}}">Description</span></li>
                                        <li><span class="dropdown-item" data-function-call="" data-file="{{$file['name']}}">Delete</span></li>
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