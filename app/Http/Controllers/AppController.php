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

        $files = $this->listAllFiles();

        return view('app/index', [
            'files' => $files,
        ]);
    }

    
    public function listAllFiles(){
        $path = $this->userPath();
        $allFiles = Storage::files($path);
        $files = [];
        $i = 0;
        foreach($allFiles as $file){
            // if it's super zip file, skip;
            if(basename($file) == 'StoreIt.zip') continue;
            $i++;
            $query = DB::table('files')->where( 'owner', Session::get('token' ))->where( 'name', basename($file) )->first();
            $files += [
                "$i" => [
                    'name'       => basename($file),
                    'url'        => Storage::url($file),
                    // 'lastMod'    => $query->updated_at,
                    // 'description'=> $query->description,
                    'lastMod'    => "updated_at",
                    'description'=> "description",
                    'size'       => Storage::size($file),
                    'ext'        => Storage::mimeType($file),
                ]
            ];
        }
        return $files;
    }

    public function recentlyEdited(){

        return "recentlyEdited";
    }

    /**
     * Create token for unregistered users. It's based on:
     *      exp time: 14 days (2 weeks) from last action
     *      IP
     *      hash made of IP and created_at, made via md5 since it's only supposed to be unique
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
            // return true;
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
    
}
