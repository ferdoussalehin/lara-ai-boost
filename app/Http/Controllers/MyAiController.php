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
use Laravel\Ai\Transcription;

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
        /**
         * Tell me about this image or describe the content of this image
         */
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
        $topic = $validated['content_topic'];
        /**
         * save the updated image in the storage
         */
        $imageInput = $request->file('image');
        $fileName = $imageInput->getClientOriginalName();
        $path = Storage::putFileAs('uploads', $request->file('image'), $fileName);
        /**
         * Update the attachment photo. Ex. Change the background of image into light blue
         */
        $image = Image::of($topic)
            ->attachments([
                Files\Image::fromStorage($path),
            ])
            ->generate();
        /**
         * Only generate image from the topic
         * $image = Image::of($topic)->generate(); 
         */
        /**
         * Store the generated image in the storage 
         * $path = $image->store();
         * $path = $image->storeAs('image.jpg');
         * $path = $image->storePublicly();
         * $path = $image->storePubliclyAs('my-image.jpg');
         */
        $path =  $image->storePubliclyAs("generated/" . $fileName);
        $path = asset('storage/'.$path);
        return Inertia::render('Ai/ImageGenerator', [
            'result' => $path,
            'submittedTopic' => $topic
        ]);
    }

    public function transcriptGenerator()
    {
        return Inertia::render('Ai/TranscriptGenerator');
    }

    public function transcriptGeneratorProcess(Request $request)
    {
        /**
         * Upload audio file or give text
         */
        $transcript = Transcription::fromUpload($request->file('file'))->generate();
        /** Error: Application rate limited by AI provider [openai]. */
        // return (string) $transcript;
        return Inertia::render('Ai/TranscriptGenerator', [
            'result' => (string) $transcript,
        ]);
    }

    public function audioGeneratorProcess(Request $request)
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
