import GajiShowsDetail from "../GajiComponent/GajiShowsDetail";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <GajiShowsDetail id={id} />;
}