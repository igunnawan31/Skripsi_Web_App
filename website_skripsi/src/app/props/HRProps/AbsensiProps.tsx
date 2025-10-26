export type AbsensiRequestProps = {
    showButton?: boolean;
    buttonText?: string;
    onButtonClick?: (invoiceId: string) => void;
    loading?: boolean;
};
