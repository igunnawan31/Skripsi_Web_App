import KontrakKerjaDetail from "../ManajemenProjectComponent/ProjectShowsDetail";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <KontrakKerjaDetail id={id} />;
}