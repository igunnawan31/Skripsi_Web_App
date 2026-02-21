import { useState } from "react";

const EditUserModal = ({ fetchedData, onClose, mutate }: any) => {
    const [formData, setFormData] = useState({
        name: fetchedData?.name || "",
        email: fetchedData?.email || "",
        majorRole: fetchedData?.majorRole || "",
        minorRole: fetchedData?.minorRole || "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutate({ id: fetchedData.id, ...formData }, {
            onSuccess: () => onClose()
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl w-[400px] flex flex-col gap-4">
                <h3 className="font-semibold">Update Information</h3>
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-500">Name</label>
                    <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="border p-2 rounded-lg text-sm" />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-500">Email</label>
                    <input value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="border p-2 rounded-lg text-sm" />
                </div>
                <div className="flex gap-2 mt-4">
                    <button type="button" onClick={onClose} className="flex-1 py-2 text-sm bg-gray-100 rounded-lg">Cancel</button>
                    <button type="submit" className="flex-1 py-2 text-sm bg-yellow-600 text-white rounded-lg">Update</button>
                </div>
            </form>
        </div>
    );
};

export default EditUserModal