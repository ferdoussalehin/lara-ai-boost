import { useForm } from '@inertiajs/react';

interface Props {
    result?: string | null;
    submittedTopic?: string | null;
}

export default function ImageAnalyzer({ result = null, submittedTopic = null }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        content_topic: '',
        image: null as File | null,
    });

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post(route('image.analyzer'), {
            onSuccess: () => {
                setData('content_topic', '');
                setData('image', null);
            },
            forceFormData: true,
        });
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] || null;
        setData('image', file);
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="w-full max-w-xl bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h1 className="text-2xl font-semibold text-gray-800 mb-1">Image Analyzer</h1>

                <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
                    <div>
                        <label
                            htmlFor="image"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Upload Image
                        </label>
                        <input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {errors.image && (
                            <p className="mt-1 text-xs text-red-500">{errors.image}</p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="content_topic"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Image Context
                        </label>
                        <input
                            id="content_topic"
                            type="text"
                            value={data.content_topic}
                            onChange={(e) => setData('content_topic', e.target.value)}
                            placeholder="e.g. what is the content of the given image..."
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