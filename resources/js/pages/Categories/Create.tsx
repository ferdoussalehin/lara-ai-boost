import { FormEvent, useState } from 'react';
import { useForm, Link } from '@inertiajs/react';

export default function CategoriesCreate() {
    const { data, setData, post, errors, processing } = useForm({
        name: '',
        description: '',
        slug: '',
        active: true,
    });

    const [slugAuto, setSlugAuto] = useState(true);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        setData('name', name);

        if (slugAuto && name) {
            const slug = name
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^\w-]/g, '');
            setData('slug', slug);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/categories');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Create Category</h1>
                        <p className="mt-2 text-gray-600">Add a new category to your system.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
                        {/* Name Field */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={handleNameChange}
                                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                                    errors.name ? 'border-red-500' : 'border'
                                } px-3 py-2`}
                                placeholder="e.g., Electronics"
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                        </div>

                        {/* Slug Field */}
                        <div>
                            <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                                Slug <span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-2 mt-1">
                                <input
                                    id="slug"
                                    type="text"
                                    value={data.slug}
                                    onChange={(e) => {
                                        setData('slug', e.target.value);
                                        setSlugAuto(false);
                                    }}
                                    className={`flex-1 block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                                        errors.slug ? 'border-red-500' : 'border'
                                    } px-3 py-2`}
                                    placeholder="e.g., electronics"
                                />
                                {slugAuto && (
                                    <button
                                        type="button"
                                        onClick={() => setSlugAuto(false)}
                                        className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition"
                                    >
                                        Auto
                                    </button>
                                )}
                            </div>
                            {errors.slug && <p className="mt-1 text-sm text-red-500">{errors.slug}</p>}
                        </div>

                        {/* Description Field */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={4}
                                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                                placeholder="Optional description for this category"
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                            )}
                        </div>

                        {/* Active Field */}
                        <div className="flex items-center">
                            <input
                                id="active"
                                type="checkbox"
                                checked={data.active}
                                onChange={(e) => setData('active', e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
                                Active
                            </label>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                            >
                                {processing ? 'Creating...' : 'Create Category'}
                            </button>
                            <Link
                                href="/categories"
                                className="flex-1 text-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
