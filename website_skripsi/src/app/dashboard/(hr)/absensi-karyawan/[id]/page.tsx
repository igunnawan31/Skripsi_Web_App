import AbsensiShowsDetail from "../AbsensiComponent/AbsensiShowsDetail";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <AbsensiShowsDetail id={id} />;
}