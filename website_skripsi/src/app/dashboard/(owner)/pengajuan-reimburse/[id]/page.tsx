import ReimburseShowsDetail from "../ReimburseComponent/ReimburseShowsDetail";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <ReimburseShowsDetail id={id} />;
}