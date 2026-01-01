
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from 'expo-file-system';


export const getMimeFromUri = (uri: string): { mime: string; ext: string } => {
    const lower = uri.toLowerCase();
    if (lower.endsWith(".png")) return { mime: "image/png", ext: "png" };
    if (lower.endsWith(".jpg") || lower.endsWith(".jpeg"))
        return { mime: "image/jpeg", ext: "jpg" };
    if (lower.endsWith(".heic")) return { mime: "image/heic", ext: "heic" };
    return { mime: "image/jpeg", ext: "jpg" };
};

export const buildPhotoPart = (asset: ImagePicker.ImagePickerAsset) => {
    const fromUri = getMimeFromUri(asset.uri);
    const mime = asset.mimeType ?? fromUri.mime;
    const ext  = fromUri.ext;
    const name = asset.fileName ?? `userPhoto.${ext}`;

    return { uri: asset.uri, name, type: mime } as any;
};
``


