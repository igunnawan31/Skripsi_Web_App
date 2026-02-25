import RekapitulasiGajiShowsDetail from "../RekapGajiComponent/RekapitulasiGajiShowsDetail";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <RekapitulasiGajiShowsDetail id={id} />;
}