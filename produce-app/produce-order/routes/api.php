<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Mail\ProduceOrderMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

// Test endpoint
Route::get('/ping', function () {
    return response()->json(['message' => 'pong']);
});

Route::post('/send-order', function (Request $request) {
    try {
        Log::info('Starting order processing');
        Log::info('Request data:', $request->all());

        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.name' => 'required|string',
            'items.*.quantity' => 'required|numeric',
            'items.*.case_cost' => 'required|numeric',
            'items.*.total' => 'required|numeric'
        ]);

        Log::info('Validation passed');
        Log::info('Attempting to send email to: test@example.com');
        
        Mail::to('test@example.com')->send(new ProduceOrderMail($validated, $validated['items'][0]['total']));
        
        Log::info('Email sent');

        return response()->json(['message' => 'Order sent successfully!']);

    } catch (\Exception $e) {
        Log::error('Error: ' . $e->getMessage());
        Log::error('Stack trace: ' . $e->getTraceAsString());
        
        return response()->json([
            'error' => 'Failed to process order',
            'message' => $e->getMessage()
        ], 500);
    }
});

Route::get('/test', function () {
    return response()->json(['message' => 'API is working']);
});
