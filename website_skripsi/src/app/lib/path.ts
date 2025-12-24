export const getImageUrl = (filePath: string) => {
    return `${process.env.NEXT_PUBLIC_API_URL}/files/${filePath}`;
};

export const getPDFUrl = (filePath: string) => {
    return `${process.env.NEXT_PUBLIC_API_URL}/files/${filePath}`;
};
