import { WorkStatus } from "../enumTypes";
import { User } from "../user/userTypes";

export type AbsensiCheckIn = {
    userId: string;
    workStatus: WorkStatus;
    address: string;
    latitude: string;
    longitude: string;
    photo: string;
}

export type AbsensiResponse = {
    userId: string;
    date: string;
    workStatus: WorkStatus;
    checkIn: string;
    checkOut: string;
    address: string;
    latitude: string;
    longitude: string;
    photo: string;
    user: User;
    createdAt: string;
}