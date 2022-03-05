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
    Route::get('/files', 'AppController@listAllFiles');

    Route::get('/downloadZip', 'FileController@downloadFiles');

    Route::post('/upload', 'FileController@uploadFiles');

    // route is wild because returned value of file is storage path
    Route::prefix('storage/ftp/{owner}/{filename}')->group(function(){
        Route::delete('/delete', 'FileController@deleteFile');
        Route::post('/rename', 'FileController@renameFile');
    });
});
Auth::routes();
Route::get('/logout', '\App\Http\Controllers\Auth\LoginController@logout');
