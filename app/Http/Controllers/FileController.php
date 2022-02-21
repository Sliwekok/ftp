<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Session;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

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
            $info = [
                'status'    => 'error',
                'header'    => 'Error occured',
                'message'   => "You can't delete other users file"
            ];
            return $info;
        }
        $path = 'public/ftp/'.$owner.'/'.$filename;
        if(!Storage::exists($path)){
            $info = [
                'status'    => 'error',
                'header'    => 'Error occured',
                'message'   => "File wasn't found"
            ];
            return $info;
        }
        else{
            $storage = Storage::delete($path);
            $query   = DB::table('files')->where('owner', $owner)->where('name', $filename)->delete();   
            if($storage && $query){
                $info = [
                    'status'    => 'success',
                    'header'    => 'File deleted',
                    'message'   => "Successfully deleted file"
                ];
                return $info;
            }
            else{
                $info = [
                    'status'    => 'error',
                    'header'    => 'Error occured',
                    'message'   => "Unknown error occured"
                ];
                return $info;
            }
        }
    }
}
