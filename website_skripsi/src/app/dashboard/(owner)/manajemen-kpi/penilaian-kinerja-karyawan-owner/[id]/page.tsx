import PenilaianIndikatorDetail from "../PenilaianKinerjaKaryawan.tsx/PenilaianIndikatorDetail";


export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <PenilaianIndikatorDetail id={id} />;
}