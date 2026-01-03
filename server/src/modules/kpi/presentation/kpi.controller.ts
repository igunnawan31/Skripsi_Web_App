import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { IKPIRepository } from '../domain/repositories/kpi.repository.interface';

@Controller('kpi')
export class KpiController {
  constructor(private readonly kpiRepo: IKPIRepository) {}
}
