<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Session;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AppController extends Controller
{
    
    /**
     * Default view for index site. 
     * All routing is "hidden" - works via ajax reloading main div
     * Every function here should be returning array of files (or whatever should be)
     * that file doesn' work with files menagment - it's FileController job.
     */

    public function index(Request $request){
        
        // create directory for unregistered users        
        if(!Auth::check() && !Session::has('token')){
            $token = $this->createToken($request);
            Session::put('token', $token);
            if(!$this->createDirectory()){
                return "Error while creating a file";
            }
        }

        $username = Auth::user()->name;
        Session::put('token', $username);

        // check if user has directory, if not - create one
        if($this->userHasNoDirectory()) $this->createDirectory();

        $files = $this->listAllFiles();
        $directories = $this->getAllDirectories();

        return view('app/index', [
            'files' => $files,
            'directories' => $directories
        ]);
    }

    public function showDirectoryContent($path){
        // trim "/storage" from string to allow storage facade find files
        $path = substr($path, 8);
        $files = $this->listAllFiles($path);
        $directories = $this->getAllDirectories();
        return view('app/index', [
            'files' => $files,
            'directories' => $directories
        ]);
    }

    // get all user files, but sort by recent modification, or recently added
    public function recentlyEdited(){

        $files = $this->listAllFiles();
        foreach ($files as $key => $date){
            $sort[$key] = strtotime($date['lastMod']);
        }
        $recent = array_multisort($sort, SORT_DESC, $files);
       
        // shouldn't it be better to return only board file? create some and return less data
        // wip
        $directories = $this->getAllDirectories();

        return view('app/index', [
            'files' => $files,
            'directories' => $directories
        ]);
    }
    // search for file, where name or description or directory matches
    public function searchFiles(Request $request, $searchable){

        //some validation
        $validator = Validator::make($request->all(),[
            'search' => 'required|max:255|min:3|string', 
        ]);
        if($validator->fails()){
            $alert = $this->alert('error', 'Error occured', "Query wasn't accepted by server");
            return $alert;
        }

        $path = $this->userPath();
        $seekedFiles = [];
        $builder = DB::table("files") // search for owner only, in future might add liked files?
            ->where(function($query) use ($searchable)
            {   
                $query  ->where('owner', Session::get('token'))           // get only user files
                        ->where('name', "like", "%$searchable%")          // search for filename
                        ->orWhere('description', "LIKE", "%$searchable%") // or description
                        ->orWhere('path', "LIKE", "%$searchable%");       // or user custom directories
            })->get();

        foreach($builder as $DbFile){
            $filename = $DbFile->name;
            $filepath = $path.$filename;
            // create array out of object
            $fileData =  json_decode(json_encode($DbFile), true);
            // if file is found in DB, add it to array, or skip current file
            if( Storage::exists($filepath) && $filename == basename(Storage::url($filepath)) ){
                $fileArray = $this->createFileArray($DbFile, $filepath);
                array_push($seekedFiles, $fileArray);
            }
        }  

        $directories = $this->getAllDirectories();
        // same as recently edited return function, wip
        return view('app/index', [
            'files' => $seekedFiles,
            'directories' => $directories
        ]);
    }

    public function moveTo(Request $request){
        //some validation
        $validator = Validator::make($request->all(),[
            'oldFilepath' => 'required|string', 
            'newFilepath' => 'required|string', 
        ]);
        if($validator->fails()){
            $alert = $this->alert('error', 'Error occured', "Query wasn't accepted by server");
            return $alert;
        }
        // trim "/storage" from string to allow storage facade find files
        $oldPath = substr($request->oldFilepath, 8);
        $newPath = substr($request->newFilepath, 8);
        $filename= $request->filename;
        $owner = Session::get('token');

        // check if exists
        if(Storage::missing($oldPath)){
            $alert = $this->alert('error', 'Error occured', "File not found");
            return $alert;
        }
        // do move file via storage and update path in DB
        $storage = Storage::move($oldPath, $newPath. "/". $filename);
        $relativePath = $this->relativePath($newPath);
        $query = DB::table('files')->where('owner', $owner)->where('name', $filename)->update(['path' => $relativePath]);
        if( !$storage || !$query ){
            $alert = $this->alert('error', 'Error occured', "Server error");
            return $alert;
        }
        return;

    }

    // get all user files and return multidimensional array
    private function listAllFiles($path = null){
        // if path is not specified, get all files in main user directory
        if($path == null) $path = $this->userPath();
        $allFiles = Storage::files($path);
        $files = [];
        foreach($allFiles as $file){
            // if it's zip file, skip;
            if(basename($file) == 'StoreIt.zip') continue;
            $query = DB::table('files')->where('owner', Session::get('token'))->where('name', basename($file))->first();
            $fileArray = $this->createFileArray($query, $file);
            array_push($files, $fileArray);
        }
        return $files;
    }

    /**
     * Create token for unregistered users. It's based on:
     *      exp time: 14 days (2 weeks) from last action
     *      IP
     *      hash made of IP and created_at, made via md5 since it's only supposed to be unique
     *      it's always 32 characters
     */
    private function createToken($request){
        $time = Carbon::now();
        $ip = $request->ip();
        $hash = md5($time.$ip);
        Session::put('startDate', $time);
        return $hash;
    }
    /**
     * Create directory for users. It's based on:
     *      name: if user is logged, just username, if not - hash
     * And anyway - it's created upon file uploading
     * It also copies zip file, cuz it has some read problems while creating
     */
    private function createDirectory(){
        $path = $this->userPath();

        if(Storage::makeDirectory($path, 0777)){
            // create also zip file to allow download of group of files
            if(Storage::copy("StoreIt.zip", $path."StoreIt.zip")){
                return true;
            }
            else{
                return false;
            }
        }
        else{
            return false;
        }
    }

    // return user directory path 
    private function userPath(){
        return "/ftp/".Session::get('token')."/";
    }

    // fix default size of file to match normaln units
    private function fixFileSize($size){
        $sizes = ["B", "KB", "MB", "GB"];
        $count = 0;    
        while($size > 1024){
            $size = round($size / 1024, 2);
            $count++;
        }
        $final = $size . $sizes[$count];
        return $final;
    }

    // function to return error message (but not always)
    // extends blade layout alert and js showAlert()
    // params:  status error/success 
    //          header as main message
    //          message - longer information about information
    private function alert($status, $header, $message){
        $info = [
            'status'    => $status,
            'header'    => $header,
            'message'   => $message
        ];
        return $info;
    }

    // get all directories from given path (normally main dir of user storage), it doesn't return nested directories
    private function getAllDirectories($relPath = null){
        $path = $this->userPath() . $relPath;
        $directories = Storage::directories($path);
        $directoriesReturn = [];
        foreach($directories as $dir){
            $newDirname = $this->relativePath($dir);
            array_push($directoriesReturn, array(
                'name'      => $newDirname,
                // this is full path, storage to relate to storage facade, path as owner, newDirname as relative path
                'url'       => '/storage'. $path. $newDirname,
                'RelPath'   => $relPath,
            ));
        }
        return $directoriesReturn;
    }

    // create single array of file data 
    private function createFileArray($query,$file){
        // check if file is an image, if so, blade will show it as an image
        if(str_contains(Storage::mimeType($file), "image")){
            $isPicture = true;
        }
        else{
            $isPicture = false;
        }
        // I have no idea what am I doing here wrong, but need to be silenced, because 
        // it returns non object data, even though it is object ...
        @$lastMod = $query->updated_at;
        @$description = $query->description;
        $data = [
            'name'       => basename($file),
            'url'        => Storage::url($file),
            'lastMod'    => $lastMod,
            'description'=> $description,
            'size'       => $this->fixFileSize(Storage::size($file)),
            'ext'        => Storage::mimeType($file),
            'isPicture'  => $isPicture
        ];
        return $data;
    }

    // transforms full path into relative path (relative from user main directory)
    private function relativePath($filepath){
        $userPath = $this->userPath();
        $trimmedLen = strlen($userPath) - 1; // trim directory name, because then loaded via Storage it contains full url, -1 because it contains / at the beginnig 
        return substr($filepath,$trimmedLen);
    }

    // check if user has directory
    private function userHasNoDirectory(){
        $path = $this->userPath();
        if(Storage::exists($path)){
            return false;
        }
        return true;
    }

}
