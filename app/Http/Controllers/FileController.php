<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Session;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Zip;
use ZanySoft\Zip\ZipManager;

class FileController extends Controller
{

    /**
     * All the magic when comes to file manegment is happening here
     * uploading, deleting, renaming, zipping 
     * 
     * todo: directories, search, sorting, recent,  
     */

    public function uploadFiles(Request $request){

        //some validation
        $validator = Validator::make($request->all(),[
            'files' => 'required|max:1048576', // this is max 1gb file in kb
        ]);
        if($validator->fails()){
            $request->session()->flash('error', "Your files can't weight more than 1GB");
            return back()->withInput($request->all());
        }

        $path = $this->userPath();
        $files = $request->file('files');
        // if there are no uploaded files return error
        if(!$request->hasFile('files')){
            $request->session()->flash('error', "Select at least 1 file");
            return back()->withInput($request->all());
        }

        // go through all files uploaded
        foreach($files as $file){
            $name = $file->getClientOriginalName();

            // create hash for file, something like id 
            // $hash = md5($path.'/'.$name);

            if(strlen($name) > 127){
                $alert = $this->alert('error', 'Error occured', "Can't save file with such a long name");
                return $alert;
            }
            // if file with the same name already exists, add (index) to the name
            if(Storage::exists("$path/$name")){
                $i = 0;
                // to do loop to create index number to already existing file
                // while()
            }
            if(!Storage::putFileAs($path, $file, $name)){
                $alert = $this->alert('error', 'Error occured', "Error while uploading files!");
                return $alert;
            }

            // save in DB 
            DB::table("files")->insert([
                "name"  => $name,
                "owner" => Session::get('token'),
            ]);

        }

        $alert = $this->alert('success', 'Files uploaded', "All files uploaded successfully");
        return $alert;
    }


    // delete single file or directory from storage and DB
    public function deleteFile($owner, $filename){        
        // check for auth
        if($owner !== Session::get('token')){
            $alert = $this->alert('error', 'Error occured', "You can't delete other users file");
            return $alert;
        }
        $path = $this->userPath();
        // check if file exists
        if(Storage::missing($path)){
            $alert = $this->alert('error', 'Error occured', "File wasn't found");
            return $alert;
        }
        $storage = Storage::delete($path.$filename);
        $query   = DB::table('files')->where('owner', $owner)->where('name', $filename)->delete();  

        if($storage && $query){
            $alert = $this->alert('success', 'File deleted', "Successfully deleted file");
            return $alert;
        }
        else{
            $alert = $this->alert('error', 'Error occured', "Unknown error occured");
            return $alert;
        }
        return;
    }

    // rename single file
    public function renameFile($owner, $filename, Request $request){
        
        if($owner !== Session::get('token')){
            $alert = $this->alert('error', 'Error occured', "You can't delete other users file");
            return $alert;
        }
        //some validation
        $validator = Validator::make($request->all(),[
            'newFilename' => 'required|max:255|min:4|string',
        ]);
        if($validator->fails()){
            $alert = $this->alert('error', 'Bad filename', 'File name cannot be blank or too long'); 
            return $alert;
        }

        $newFilename = $request->input('newFilename');
        $query = DB::table('files')->where('owner', $owner)->where('name', $filename)->update(['name' => $newFilename]);
        $path =  $this->userPath();

        if(!Storage::exists($path.$filename)){
            $alert = $this->alert('error', 'Error occured', "File wasn't found");
            return $alert;
        }
        // check if new name is the same as old filename
        if($newFilename == $filename){
            $alert = $this->alert('error', 'Error occured', "New filename must be different than before");
            return $alert;
        }
        // check if sql query works
        if(!$query){
            $alert = $this->alert('error', 'Error occured', "Server error");
            return $alert;
        }
        // check if storage function successfully renamed file 
        if(!Storage::rename($path.$filename, $path.$newFilename)){
            $alert = $this->alert('error', 'Error occured', "Can't rename file");
            return $alert;
        }

        $alert = $this->alert('success', 'File renamed', "Successfully renamed");
        return $alert;
    }

    // download zip file with selected files
    // request is an array - [0] means file url, [1] means filename
    public function downloadFiles(Request $request){
        $files = $request->input('files');
        $zipName = 'StoreIt.zip';
        $path = $this->userPath();
        $zip = Zip::open(storage_path('app'. $path . $zipName));

        // trim everything in zip, to not re-downloading the same stuff
        $zippedPreviously =  $zip->listFiles();
        foreach($zippedPreviously as $file){
            $zip->delete($file);
        }
        // add each selected file from array to zip file
        foreach($files as $file){
            // remove storage in path, since it's already in storage directory when using Storage
            $filepath = ltrim($file[0], "/storage");
            $filename = $file[1];
            if(Storage::missing($filepath)){
                $alert = $this->alert('error', 'Error occured', "File not found");
                return $alert;
            }
            // set path for user and add files
            if(!$zip->setPath("storage". $path)->add($filename)){
                $alert = $this->alert('error', 'Error occured', "Error while archiving file");
                return $alert;
            }
        }
        $zip->close();

        $downloadUrl = Storage::url($path. $zipName);
        return $downloadUrl;
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

    // return user directory path 
    private function userPath(){
        return "/ftp/".Session::get('token')."/";
    }
}
