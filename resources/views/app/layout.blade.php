<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>StoreIt - free file hosting server made for you</title>

    <!-- Scripts -->
    <script src="https://code.jquery.com/jquery-3.6.0.js" integrity="sha256-H+K7U5CnXl1h5ywQfKtSj8PCmoN9aaq30gDh27Xc0jk=" crossorigin="anonymous" defer></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous" defer></script>
    <script src="{{ asset('js/app.js') }}" defer></script>
    
    <!-- Fonts -->
    <link rel="dns-prefetch" href="//fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet">
    
    <!-- Styles -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRk2vvoC2f3B09zVXn8CA5QIVfZOJ3BCsw2P0p/We" crossorigin="anonymous">
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
    {{-- delete y-axis scroll bar --}}
    <style>
        body, html{
            overflow: hidden !important;
        }
    </style>
</head>
<body>

<div class="container-fluid">
<div class="row">

    <main class="container-fluid" style="padding:0px;">
        <div class="row">
            <nav id="sideNav" class="col-2">
                <div class="row">
                    <div id="account">
                        @auth
                            <p id="username">{{Auth::user()->name}}</p>
                        @else
                            <p id="username">Trial account</p>
                            <span id="anonymousPrompt">You are using free account. That means your files will be automatically deleted after 14 days from uploding. You can change it by <a href="{{url('register')}}">signing up</a></span>
                        @endauth
                    </div>
                </div>

                <div class="row">
                    <div id="generalActions">
                        <div class="row">
                            <div class="col-12 fileAction" data-destination="{{url('app/')}}"><span><i class="fontello icon-folder"></i>My files</span></div>
                            <div class="col-12 fileAction" data-destination="{{url('app/recent')}}"><span><i class="fontello icon-clock"></i>Recent Files</span></div>
                            <div class="col-12 fileAction" data-destination="{{url('logout')}}"><span>Logout</span></div>
                        </div>
                    </div>
                </div>

            </nav>

            <div class="col-10 container" id="rightPanel">
                <div class="row">
                    <nav id="topNav" class="col-12">
                        <div class="col-4"><span id="logo">StoreIt</span></div>
                        <div class="col-8" id="menuTop">
                            <div class="menuItem offset-8" id="upload"><i class="fontello icon-upload"></i>Upload</div>
                            <div class="menuItem" id="findButton"><i class="fontello icon-find"></i>Find</div>
                        </div>
                        <div class="col-8" id="searchBox">
                            <form id="searcher">
                                <input type="text" name="search" required min="3" id="search" autocomplete="off" title="Search for file name, description or in directories">
                                <span title="Exit search form" id="exitSearchForm"><i class="icon icon-cancel"></i></span>
                            </form>
                        </div>
                    </nav>
                </div>

                <div class="row">
                    <div id="app" class="col-12">
                        @yield('content')
                    </div>
                </div>

        </div>

        @include('app.assets')

    </main>
</div>
</div>

</body>
</html>