import UpdateManajemenIndikatorComponent from "../../ManajemenIndikatorComponent/UpdateManajemenIndikatorComponent";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <UpdateManajemenIndikatorComponent id={id} />;
}
