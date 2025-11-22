import ManajemenIndikatorDetail from "../ManajemenIndikatorComponent/ManajemenIndikatorDetail";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <ManajemenIndikatorDetail id={id} />;
}