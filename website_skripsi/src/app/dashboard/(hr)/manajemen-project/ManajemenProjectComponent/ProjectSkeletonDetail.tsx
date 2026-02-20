const SkeletonDetail = () => {
    return (
        <div className="flex flex-col gap-6 w-full pb-8 animate-pulse">
            <div className="w-48 h-10 bg-gray-300 rounded-lg" />
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="w-64 h-8 bg-gray-300 rounded-md" />
                <div className="w-32 h-4 bg-gray-300 rounded-md mt-2 sm:mt-0" />
            </div>

            <div className="w-full bg-white rounded-2xl shadow-md p-6 border border-gray-200 flex flex-col gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex flex-col gap-2">
                        <div className="w-24 h-4 bg-gray-300 rounded" />
                        <div className="w-full h-10 bg-gray-300 rounded-lg border border-gray-200" />
                    </div>
                ))}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <div className="w-24 h-4 bg-gray-300 rounded" />
                        <div className="w-full h-10 bg-gray-300 rounded-lg" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="w-24 h-4 bg-gray-300 rounded" />
                        <div className="w-full h-10 bg-gray-300 rounded-lg" />
                    </div>
                </div>
                <div className="mt-6 border-t border-gray-100 pt-6">
                    <div className="w-40 h-6 bg-gray-300 rounded mb-4" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="h-20 bg-gray-300 rounded-lg border border-gray-200" />
                        <div className="h-20 bg-gray-300 rounded-lg border border-gray-200" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SkeletonDetail;