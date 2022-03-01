<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Session;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use zipArchive;

class FileController extends Controller
{

    /**
     * All the magic when comes to file manegment is happening here
     * uploading, deleting, renaming etc
     * normally, after the controller job is done it redirects request to AppController 
     *      to show updated state, but there are some exceptions like deleting
     */

    public function uploadFiles(Request $request){

        //some validation
        $validator = Validator::make($request->all(),[
            'files' => 'required|max:1048576', // this is max 1gb file in kb
        ]);
        if($validator->fails()){
            $request->session()->flash('error', "Your files can't weight more than 1GB");
            return back()->withInput($request->all());;
        }

        $files = $request->file('files');
        // if there are no uploaded files return error
        if(!$request->hasFile('files')){
            $request->session()->flash('error', "Select at least 1 file");
            return back()->withInput($request->all());
        }

        // go through all files uploaded
        foreach($files as $file){
            // static path 
            $path = 'public/ftp/'.Session::get('token');
            $name = $file->getClientOriginalName();

            // create hash for file, something like id 
            // $hash = md5($path.'/'.$name);

            if(strlen($name) > 127){
                $request->session()->flash('error', "Can't save file with such a long name");
                return back()->withInput($request->all());
            }
            // if file with the same name already exists
            if(Storage::exists("$path/$name")){
                $request->session()->flash('error', "File $name seems to be already exists");
                return back()->withInput($request->all());
            }
            if(!Storage::putFileAs($path, $file, $name)){
                $request->session()->flash('error', "Error while uploading files!");
                return back()->withInput($request->all());
            }

            // save in DB 
            DB::table("files")->insert([
                "name"  => $name,
                "owner" => Session::get('token'),
            ]);

        }

        $request->session()->flash('success', "Files uploaded successfully!");
        return back()->withInput($request->all());
    }


    // delete single file from storage and DB
    public function deleteFile($owner, $filename, Request $request){        
        if($owner !== Session::get('token')){
            $alert = $this->alert('error', 'Error occured', "You can't delete other users file");
            return $alert;
        }
        $path = 'public/ftp/'.$owner.'/'.$filename;
        if(!Storage::exists($path)){
            $alert = $this->alert('error', 'Error occured', "File wasn't found");
            return $alert;
        }
        else{
            $storage = Storage::delete($path);
            $query   = DB::table('files')->where('owner', $owner)->where('name', $filename)->delete();   
            if($storage && $query){
                $alert = $this->alert('success', 'File deleted', "Successfully deleted file");
                return $alert;
            }
            else{
                $alert = $this->alert('error', 'Error occured', "Unknown error occured");
                return $alert;
            }
        }
    }

    // rename single file
    public function renameFile($owner, $filename, Request $request){
        
        if($owner !== Session::get('token')){
            $alert = $this->alert('error', 'Error occured', "You can't delete other users file");
            return $alert;
        }

        //some validation
        $validator = Validator::make($request->all(),[
            'newFilename' => 'required|max:255|min:4|string', // this is max 1gb file in kb
        ]);
        if($validator->fails()){
            $alert = $this->alert('error', 'Bad filename', 'File name cannot be blank or too long'); 
            return $alert;
        }

        $newFilename = $request->input('newFilename');
        $query = DB::table('files')->where('owner', $owner)->where('name', $filename)->update(['name' => $newFilename]);
        $path = 'public/ftp/'.$owner.'/';

        // some validation
        if(!Storage::exists($path.$filename)){
            $alert = $this->alert('error', 'Error occured', "File wasn't found");
            return $alert;
        }
        if(!$query){
            $alert = $this->alert('error', 'Error occured', "Server error");
            return $alert;
        }
        if(!Storage::rename($path.$filename, $path.$newFilename)){
            $alert = $this->alert('error', 'Error occured', "Server error");
            return $alert;
        }

        $alert = $this->alert('success', 'File renamed', "Successfully renamed");
        return $alert;
    }

    // download zip file with selected files
    // request is an array - [0] means file url, [1] means filename
    public function downloadFiles(Request $request){
        $files = $request->input('files');
        $zip = new ZipArchive();
        $zipName = 'StoreIt.zip';
        $path = "public/ftp/".Session::get('token')."/";
        $open = $zip->open($path . $zipName, ZipArchive::CREATE | ZipArchive::OVERWRITE);

        // fix absolute path to relative in user files, to be able to select user custom directories
        $fixRelativePath = function ($url){
            $file = $url[0];
            $string = '/storage';
            // return str_replace($string, '', $file);
            $file = ltrim($file, $string);
            return '/public'.$file;
        };
        $fixedFiles = array_map($fixRelativePath, $files);

        // check if can create zip file
        if($open){
            // loop through all requested files
            foreach($fixRelativePath as $file){
                $filepath = $file[0];
                $filename = $file[1];
                $zip->addFile(Storage::get($filepath), $filename);
            }
        }
        else{
            $alert = $this->alert('error', 'Error occured', "Couldn't create archive file");
            return $alert;
        }
        // it needs to be silenced, bc it gives error there's no zip initialized, idk why tho
        @$zip->close();
        $downloadUrl = Storage::url($path.$zipName);
        return $downloadUrl;
    }

    // funciton to return error message (but not always)
    // extends blade layout alert and js showAlert()
    // params:  status error/success 
    //          header as main message
    //          message - longer information about information
    private function alert($status, $header, $message){
        $info = array(
            'status'    => $status,
            'header'    => $header,
            'message'   => $message
        );
        return $info;
    }
}
