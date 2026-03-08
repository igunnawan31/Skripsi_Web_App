import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CutiApprovedEvent, CutiCancelledEvent, CutiRejectedEvent } from '../../application/events/cuti.events';


