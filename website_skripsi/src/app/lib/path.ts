export const getImageUrl = (filePath: string) => {
    return `${process.env.NEXT_PUBLIC_URL}/files/${filePath}`;
};