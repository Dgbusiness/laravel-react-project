<?php

namespace App\Http\Controllers;

class HomeController extends Controller
{
    public function welcome()
    {
        return response()->json([
            'service' => 'Coalition Technologies Test API',
        ]);
    }
}

