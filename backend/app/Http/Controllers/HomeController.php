<?php

namespace App\Http\Controllers;

class HomeController extends Controller
{
    public function welcome()
    {
        return response()->json([
            'service' => 'Aeximius Test API',
        ]);
    }
}

