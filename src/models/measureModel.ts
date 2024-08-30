import { MeasureType } from '@prisma/client';

export interface MeasureData {
  measure_uuid: string;
  measure_datetime: Date;
  measure_type: MeasureType;
  image_url: string;
  measure_value?: number;
  customerId: string;
}
