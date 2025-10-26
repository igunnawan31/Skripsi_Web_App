import CutiShowsDetail from "../CutiComponent/CutiShowsDetail";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <CutiShowsDetail id={id} />;
}