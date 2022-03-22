<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', 'HomeController@index');

Route::prefix('app')->group(function(){
    Route::get('/', 'AppController@index');
    Route::get('/recent', 'AppController@recentlyEdited');
    Route::get('/search/{searchable}', 'AppController@searchFiles');
    Route::get('/downloadZip', 'FileController@downloadFiles');
    Route::get('/showDirectory/{path}', 'AppController@showDirectoryContent')->where('path', '.*');
    
    Route::post('/createDirectory', 'DirectoryController@createDirectory');
    Route::post('/upload', 'FileController@uploadFiles');
    Route::post('/moveTo', 'AppController@moveTo');

    // route is quite wild because it contains value of file in storage path
    Route::prefix('storage/ftp/{owner}/{filename}')->group(function(){
        Route::delete('/delete', 'FileController@deleteFile');
        Route::post('/rename', 'FileController@renameFile');
        Route::post('/share', 'FileController@shareFile');
        
        Route::delete('/deleteDirectory', 'DirectoryController@deleteDirectory');
    });

});
Auth::routes();
Route::get('/logout', '\App\Http\Controllers\Auth\LoginController@logout');
