<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Welcome to EventMan</title>
</head>
<body>
    <h2>Welcome, {{ $user->name }}!</h2>
    <p>Thank you for registering on EventMan{{ $user->role === 'organizer' ? ' as an organizer/company' : '' }}.</p>
    @if($user->role === 'organizer')
    <p>Your organizer dashboard is ready. <a href="{{ url('/organizer-dashboard') }}">Get started here</a>.</p>
    @else
    <p>Browse and register for amazing events on our platform.</p>
    @endif
    <br>
    <small>Powered by EventMan</small>
</body>
</html>
