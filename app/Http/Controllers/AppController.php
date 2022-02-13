<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AppController extends Controller
{
    
    public function index(){
        // if not registered - create folder based on JWT token

        return view('app/index');
    }

    
    public function listAllFiles(){
        return "all files";
    }

    public function recentlyEdited(){
        return "recentlyEdited";
    }

    public function uploadFiles(){

    }

}
