import { useForm } from '@inertiajs/react';

interface Props {
    result?: string | null;
    submittedTopic?: string | null;
}

export default function ContentWriter({ result = null, submittedTopic = null }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        content_topic: '',
    });

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post(route('content.writer.process'), {
            // onSuccess: () => reset('content_topic'), // Only reset topic, keep ID
            onSuccess: () => setData('content_topic', ''), // Better than full reset
        });
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="w-full max-w-xl bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h1 className="text-2xl font-semibold text-gray-800 mb-1">AI Content Writer</h1>
                <p className="text-sm text-gray-500 mb-6">Enter a topic and AI will process it for you.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="content_topic"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Content Topic (Give only the topic, no need to write any prompt)
                        </label>
                        <input
                            id="content_topic"
                            type="text"
                            value={data.content_topic}
                            onChange={(e) => setData('content_topic', e.target.value)}
                            placeholder="e.g. The future of renewable energy"
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                        {errors.content_topic && (
                            <p className="mt-1 text-xs text-red-500">{errors.content_topic}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium py-2.5 rounded-lg transition"
                    >
                        {processing ? 'Processing…' : 'Submit'}
                    </button>
                </form>

                {result && (
                    <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
                            Result for "{submittedTopic}"
                        </p>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{result}</p>
                    </div>
                )}
            </div>
        </div>
    );
}