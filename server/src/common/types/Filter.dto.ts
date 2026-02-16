import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString } from "class-validator";

export class FilterDTO {
  @IsOptional()
  @IsString()
  searchTerm?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}

// Sort Values
export const ALLOWED_REIMBURSE_SORT_FIELDS = [
  'title',
  'totalExpenses',
  'createdAt',
] as const;

export type ReimburseSortField = typeof ALLOWED_REIMBURSE_SORT_FIELDS[number];

export const ALLOWED_AGENDA_SORT_FIELDS = [
  'status',
  'createdAt',
  'eventDate'
] as const;

export type AgendaSortField = typeof ALLOWED_AGENDA_SORT_FIELDS[number]

export const ALLOWED_INDIKATOR_KPI_SORT_FIELDS = [
  'status',
  'startDate',
  'endDate',
  'createdAt',
  'name'
]

export type IndikatorKPISortField = typeof ALLOWED_INDIKATOR_KPI_SORT_FIELDS[number]

export const ALLOWED_JAWABAN_KPI_SORT_FIELDS = [
  'createdAt',
  'nilai',
]

export type JawabanKPISortField = typeof ALLOWED_INDIKATOR_KPI_SORT_FIELDS[number]

export const ALLOWED_PERTANYAAN_KPI_SORT_FIELDS = [
  'createdAt',
  'kategori',
  'urutanSoal',
  'bobot',
]

export type PertanyaanKPISortField = typeof ALLOWED_PERTANYAAN_KPI_SORT_FIELDS[number]

export const ALLOWED_SKALA_NILAI_KPI_SORT_FIELDS = [
  'createdAt',
  'name',
]

export type SkalaNilaiKPISortField = typeof ALLOWED_SKALA_NILAI_KPI_SORT_FIELDS[number]
