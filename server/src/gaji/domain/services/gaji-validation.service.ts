import { Injectable } from "@nestjs/common";

@Injectable()
export class GajiValidationService {
    validateDates(periode: Date, dueDate: Date) : {
       valid: boolean;
       message: string; 
    } {
        if (!periode || !dueDate) {
            return {
                valid: false,
                message: 'Periode dan Tenggat Waktu harus diisi',
            };
        }

        return {
            valid: true,
            message: 'Periode dan tenggat waktu berhasil dimasukkan'
        };
    }

    validateAmount(amount: number) : {
        valid: boolean;
        message: string;
    } {
        if (!amount) {
            return {
                valid: false,
                message: "Amount harus diisi",
            }
        }
        if (amount < 0) {
            return {
                valid: false,
                message: 'Amount tidak boleh kurang dari 0',
            }
        }

        return {
            valid: true,
            message: 'Amount berhasil dimasukkan'
        }
    }

}