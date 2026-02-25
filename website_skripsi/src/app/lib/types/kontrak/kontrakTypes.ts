import { EmployeeType, KontrakKerjaStatus, MajorRole, MetodePembayaran, MinorRole } from "../enumTypes";
import { ResponseProject } from "../fixTypes";
import { Gaji, User } from "../types";

export type KontrakResponse = {
    id: string;
    userId: string;
    projectId: string;

    jenis: EmployeeType;
    metodePembayaran: MetodePembayaran;
    dpPercentage?: number;
    finalPercentage?: number;
    totalBayaran: number;
    absensiBulanan: number;
    cutiBulanan: number;
    status: KontrakKerjaStatus;
    catatan?: string;
    documents?: JSON;
    
    startDate: string;
    endDate: string;
    createdAt: string;
    updatedAt: string;

    user: User;
    project: ResponseProject;
    gaji: Gaji;
}

export type CreateKontrakKerja = {
    userData: {
        id?: string;
        email?: string;
        name?: string;
        password?: string;
        majorRole?: MajorRole | "";
        minorRole?: MinorRole | "";
    };
    projectData: {
        id: string;
    },

    jenis: EmployeeType | "";
    metodePembayaran: MetodePembayaran | "";
    dpPercentage?: number | 0;
    finalPercentage?: number | 0;
    totalBayaran: number;

    absensiBulanan: number;
    cutiBulanan: number;
    status: KontrakKerjaStatus;
    catatan?: string;
    contractDocuments: File[] | null;
    userPhoto: File | null;

    startDate: string;
    endDate: string;
}

export type UpdateKontrakKerja = {
    userData: {
        email: string;
        name: string;
        password: string;
        majorRole: MajorRole | "";
        minorRole: MinorRole | "";
    },
    projectData: {
        id: string;
    },

    jenis: EmployeeType | "";
    metodePembayaran: MetodePembayaran | "";
    dpPercentage?: number | 0;
    finalPercentage?: number | 0;
    totalBayaran: number;

    absensiBulanan: number;
    cutiBulanan: number;
    status: KontrakKerjaStatus;
    catatan?: string;
    contractDocuments: File[] | null;
    userPhoto: File | null;

    startDate: string;
    endDate: string;

    removeDocuments: string[];
}

// internal  {
//   metodePembayaran: 'MONTHLY',
//   dpPercentage: undefined,
//   finalPercentage: undefined,
//   totalBayaran: 10000000,

//   absensiBulanan: 31,
//   cutiBulanan: 3,
//   status: undefined,
//   catatan: undefined,

//   startDate: 2026-01-01T00:00:00.000Z,
//   endDate: 2026-03-01T00:00:00.000Z,

//   jenis: 'CONTRACT',

//   userData: {
//     name: 'Aldisar Gibran',
//     email: 'aldisarg@be5.com',
//     password: 'Rahasia123',
//     minorRole: 'BACKEND',
//     photo: {
//       fieldname: 'userPhoto',
//       originalname: 'gambar.png',
//       encoding: '7bit',
//       mimetype: 'image/png',
//       destination: './uploads/userPhoto',
//       filename: 'userPhoto-1767529726136-732684733.png',
//       path: 'uploads/userPhoto/userPhoto-1767529726136-732684733.png',
//       size: 26733
//     }
//   },

//   projectData: {
//     id: '8b34da56-3037-4bfc-b228-eebfaab5d8e1',
//     startDate: Invalid Date,
//     endDate: Invalid Date,
//     documents: [ [Object] ]
//   },

//   documents: [
//     {
//       fieldname: 'contractDocuments',
//       originalname: 'Motivation Letter RNB.pdf',
//       encoding: '7bit',
//       mimetype: 'application/pdf',
//       destination: './uploads/contractDocuments',
//       filename: 'contractDocuments-1767529726136-812883571.pdf',
//       path: 'uploads/contractDocuments/contractDocuments-1767529726136-812883571.pdf',
//       size: 14068
//     }
//   ]
// }