import RekapitulasiCutiShowsDetail from "../RekapCutiComponent/RekapitulasiCutiShowsDetail";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <RekapitulasiCutiShowsDetail id={id} />;
}