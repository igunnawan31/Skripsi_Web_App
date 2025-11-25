import UpdateMKPage from "../../ManajemenKaryawanComponent/UpdateMKPage";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <UpdateMKPage id={id} />;
}
