import { User } from "../types"

export type AbsensiResponse = {
    userId: string,
    date: string,
    workStatus: string,
    checkIn: string,
    checkOut: string,
    address: string,
    latitude: string,
    longitude: string,
    createdAt: string,
    photo: any,
    user: User
}