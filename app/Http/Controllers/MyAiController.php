<?php
namespace App\Http\Controllers;

use App\Ai\Agents\ContentWriter;
use App\Ai\Agents\PersonalAssistant;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Ai\Agents\ImageAnalyzer;
use Laravel\Ai\Files;
use Laravel\Ai\Image;
use Illuminate\Support\Str;
use Laravel\Ai\Audio;
use Illuminate\Support\Facades\Storage;

class MyAiController extends Controller
{
    public function contentWriter()
    {
        return Inertia::render('Ai/ContentWriter');
    }

    public function contentWriterProcess(Request $request)
    {
        $validated = $request->validate([
            'content_topic' => 'required|string|max:255',
        ]);
        $topic = $validated['content_topic'];
        /** Normal prompt call */
        /*$response =  (new ContentWriter)->prompt(
            "Write a short article about the topic: {$topic}"
        );*/
        /** prompt with make() method */
        $response =  ContentWriter::make()->prompt(
            "Write a short article about the topic: {$topic}"
        );
        /**
         * Structured output
         * Access the returned StructuredAgentResponse like an array
         * return $response['message'];
         */
        return Inertia::render('Ai/ContentWriter', [
            'result' => $response->text,
            'submittedTopic' => $topic
        ]);
    }

    public function chat()
    {
        return Inertia::render('Ai/Chat');
    }

    public function chatStore(Request $request)
    {
        $request->validate([
            'message' => 'required|string',
            'conversationId' => 'nullable|string',
        ]);
        // logger("Conversation ID received: " . $request->conversationId);
        $assistant = new PersonalAssistant();
        $user = User::query()->first();
        
        if ($request->conversationId) {
            // Continue existing conversation
            $response = $assistant
                ->continue($request->conversationId, as: $user)
                ->prompt($request->message);
        } else {
            // Start new conversation
            $response = $assistant
                ->forUser($user)
                ->prompt($request->message);
        }
        return response()->json([
            'answer' => $response->text, // or $response->text() depending on your package
            'conversationId' => $response->conversationId,
        ]);
    }

    public function imageAnalyzer()
    {
        return Inertia::render('Ai/ImageAnalyzer');
    }

    public function imageAnalyzerProcess(Request $request)
    {
        $validated = $request->validate([
            'content_topic' => 'required|string|max:255',
        ]);
        $topic = $validated['content_topic'];
        $response =  (new ImageAnalyzer())->prompt(
            "{$topic}",
            attachments: [
                /** Attach an uploaded file */
                $request->file('image')
                /** 
                 * Attach an image from a local path 
                 * Files\Image::fromPath(storage_path('23.jpg'))
                 */
                /** 
                 * Attach an image from a filesystem disk
                 * Files\Image::fromStorage('23.jpg')
                 */
            ]
        );
        return Inertia::render('Ai/ImageAnalyzer', [
            'result' => $response->text,
            'submittedTopic' => $topic
        ]);
    }

    public function imageGenerator()
    {
        return Inertia::render('Ai/ImageGenerator');
    }

    public function imageGeneratorProcess(Request $request)
    {
        $validated = $request->validate([
            'content_topic' => 'required|string|max:255',
        ]);
        // dd(asset('storage/app/private/'.'my-image.jpg'));
        $topic = $validated['content_topic'];
        $image = Image::of($topic)->generate();
        /**
         * $path = $image->store();
         * $path = $image->storeAs('image.jpg');
         * $path = $image->storePublicly();
         * $path = $image->storePubliclyAs('my-image.jpg');
         */

        $path =  $image->storePubliclyAs('my-image.jpg');
        $path = asset('storage/'.$path);

        return Inertia::render('Ai/ImageGenerator', [
            'result' => $path,
            'submittedTopic' => $topic
        ]);
    }

    public function ximageGeneratorProcess(Request $request)
    {
        $validated = $request->validate([
            'content_topic' => 'required|string|max:255',
        ]);
        $topic = $validated['content_topic'];
        $audio = Audio::of($topic)
            ->female()
            ->instructions('Said like a pirate')
            ->generate();
        /**
         * $path = $image->store();
         * $path = $image->storeAs('image.jpg');
         * $path = $image->storePublicly();
         * $path = $image->storePubliclyAs('my-image.jpg');
         */
        $path =  $audio->storePubliclyAs('my-mp3.mp3');
        return Inertia::render('Ai/ImageGenerator', [
            'result' => $path,
            'submittedTopic' => $topic
        ]);
    }

}
