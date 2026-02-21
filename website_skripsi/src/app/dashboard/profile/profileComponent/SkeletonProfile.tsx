const SkeletonProfile = () => {
    return (
        <div className="flex flex-col gap-6 w-full pb-8 animate-pulse">
            <div className="w-48 h-10 bg-gray-300 rounded-lg" />
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="w-64 h-8 bg-gray-300 rounded-md" />
            </div>

            <div className="w-full h-30 bg-gray-300 rounded-lg" />
            <div className="w-full h-40 bg-gray-300 rounded-lg" />
            <div className="w-full h-80 bg-gray-300 rounded-lg" />
        </div>
    );
};

export default SkeletonProfile;