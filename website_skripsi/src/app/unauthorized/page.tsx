export default function UnauthorizedPage() {
    return (
        <div className="h-screen flex flex-col items-center justify-center gap-4">
            <h1 className="text-2xl font-bold text-red-600">Unauthorized Access</h1>
            <p className="text-gray-600">You do not have permission to view this page.</p>
        </div>
    );
}
