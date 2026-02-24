import UpdateKontrakKerjaPage from "../../KontrakKerjaComponent/UpdateKontrakKerjaPage";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <UpdateKontrakKerjaPage id={id} />;
}
