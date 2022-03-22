<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Session;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class DirectoryController extends Controller
{

    public function createDirectory(Request $request){

        $dirName = $request->folderName;
        $path = $this->userPath();

        if(Storage::exists($path . $dirName)){
            $alert = $this->alert('error', 'Error occured', "One of your directories already exists with that name");
            return $alert;
        }
        
        if(!Storage::makeDirectory($path . $dirName)){
            $alert = $this->alert('error', 'Error occured', "Server error");
            return $alert;
        }

        // save in DB 
        DB::table("directories")->insert([
            "name"  => $dirName,
            "owner" => Session::get('token'),
        ]);

        $alert = $this->alert('success', 'Directory saved', "You can now access new directory");
        return $alert;
    }

    // delete directory function
    public function deleteDirectory($owner, $filename){       
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
        $storage = Storage::deleteDirectory($path.$filename);
        $query   = DB::table('directories')->where('owner', $owner)->where('name', $filename)->delete();  

        if($storage && $query){
            $alert = $this->alert('success', 'File deleted', "Successfully deleted file");
            return $alert;
        }
        else{
            $alert = $this->alert('error', 'Error occured', "Unknown error occured");
            return $alert;
        }
    }
    
    // funciton to return error message (but not always)
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
