import KontrakKerjaDetail from "../KontrakKerjaComponent/KontrakKerjaShowsDetail";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <KontrakKerjaDetail id={id} />;
}