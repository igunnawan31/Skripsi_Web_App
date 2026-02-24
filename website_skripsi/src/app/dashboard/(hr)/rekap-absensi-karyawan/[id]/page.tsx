import RekapitulasiAbsensiShowsDetail from "../RekapAbsensiComponent/RekapitulasiAbsensiShowsDetail";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <RekapitulasiAbsensiShowsDetail id={id} />;
}