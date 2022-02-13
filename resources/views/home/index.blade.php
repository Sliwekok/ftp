@extends('home.layout')

@section('content')
<div id="index">
    <div id="baner" class="col-12">
        <div id="centerText">
            <p id="mainText">StoreIt</p>
            <p id="subText">free file hosting to made it simple</p>
        </div>

        <div class="col-6 offset-3" id="buttons">
            <div class="col-4 offset-2"><a href="{{url('/app')}}"><button class="btn btn-primary">Start now</button></a></div>
            <div class="col-4"><a href="{{url('/login')}}"><button class="btn btn-primary">Log in</button></a></div>
        </div>
        
        <img alt="baner" id="backgroundImage" src="{{asset('images/baner-darken.jpg')}}">
    </div>
</div>
    
@endsection