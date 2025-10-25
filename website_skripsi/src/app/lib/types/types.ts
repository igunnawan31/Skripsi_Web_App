export type Absensi = {
    id: string;
    name: string;
    workStatus: "Work From Home" | "Work From Office" | "Hybrid";
    majorRole: string;
    minorRole: string;
    date: string;
    checkIn: string;
    checkOut: string;
}

export type AbsensiRequestProps = {
    showButton?: boolean;
    buttonText?: string;
    onButtonClick?: (invoiceId: string) => void;
    loading?: boolean;
};