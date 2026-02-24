import HasilKKDetail from "../HasilKinerjaKaryawanComponent/HasilKKDetail";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <HasilKKDetail id={id} />;
}