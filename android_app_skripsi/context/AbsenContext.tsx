import { createContext, useContext, useState } from "react";

type LocationData = {
    latitude: number | null;
    longitude: number | null;
    address: string;
};

type AbsenContextType = {
    location: LocationData;
    setLocationData: (latitude: number, longitude: number, address: string) => void;
    photoUrl: string | null;
    setPhotoUrl: (url: string) => void;
    resetAbsen: () => void;
};

const AbsenContext = createContext<AbsenContextType | undefined>(undefined);

export const AbsenProvider: React.FC<{ children: React.ReactNode}> = ({ children }) => {
    const [location, setLocation] = useState<LocationData>({
        latitude: null,
        longitude: null,
        address: "",
    });
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);

    const setLocationData = ( latitude: number, longitude: number, address: string ) => {
        setLocation({latitude, longitude, address})
    }; 

    const resetAbsen = () => {
        setLocation({ latitude: null, longitude: null, address: ""});
        setPhotoUrl(null);
    };

     return (
        <AbsenContext.Provider
            value={{ location, photoUrl, setLocationData, setPhotoUrl, resetAbsen }}
        >
            {children}
        </AbsenContext.Provider>
    );
};

export const useAbsen = () => {
    const context = useContext(AbsenContext);
    if (!context) {
        throw new Error("useAbsen must be used within an AbsenProvider");
    }
    return context;
};