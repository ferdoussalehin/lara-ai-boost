import { useForm } from '@inertiajs/react';

interface Props {
    result?: string | null;
    submittedTopic?: string | null;
}

export default function FileAnalyzer({ result = null, submittedTopic = null }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        file: null as File | null,
    });

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post(route('transcript.generator'), {
            onSuccess: () => {
                setData('file', null);
            },
            forceFormData: true,
        });
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] || null;
        setData('file', file);
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="w-full max-w-xl bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h1 className="text-2xl font-semibold text-gray-800 mb-1">Image Analyzer</h1>

                <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
                    <div>
                        <label
                            htmlFor="file"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Upload Audio File
                        </label>
                        <input
                            id="file"
                            type="file"
                            onChange={handleFileChange}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {errors.file && (
                            <p className="mt-1 text-xs text-red-500">{errors.file}</p>
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
                        {result}
                    </div>
                )}
            </div>
        </div>
    );
}