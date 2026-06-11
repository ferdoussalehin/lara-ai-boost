<?php

use App\Ai\Agents\SalesCoach;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\MyAiController;
use Illuminate\Support\Facades\Auth;

Route::get('/', function () {
    return Inertia::render('auth.login');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    
    Route::get('/agent/content/writer', [MyAiController::class, 'contentWriter']);
    Route::post('/agent/content/writer', [MyAiController::class, 'contentWriterProcess'])->name('content.writer.process');
    
    Route::get('/agent/chat', [MyAiController::class, 'chat'])->name('chat.index');
    Route::post('/agent/chat', [MyAiController::class, 'chatStore'])->name('chat.store');

    Route::get('/agent/image/analyzer', [MyAiController::class, 'imageAnalyzer']);
    Route::post('/agent/image/analyzer/process', [MyAiController::class, 'imageAnalyzerProcess'])->name('image.analyzer');

    Route::get('/agent/image/generator', [MyAiController::class, 'imageGenerator']);
    Route::post('/agent/image/generator/process', [MyAiController::class, 'imageGeneratorProcess'])->name('image.generator');
    
    Route::get('/agent/transcript/generator', [MyAiController::class, 'transcriptGenerator']);
    Route::post('/agent/transcript/generator/process', [MyAiController::class, 'transcriptGeneratorProcess'])->name('transcript.generator');

    Route::get('/agent/audio/generator', [MyAiController::class, 'audioGenerator']);
    Route::post('/agent/audio/generator/process', [MyAiController::class, 'audioGeneratorProcess'])->name('audio.generator');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
