import { MeasureData } from '../models/measureModel';
import { prisma } from '../utils/prisma';

export const findExistingMeasure = async (
  customer_code: string,
  measure_datetime: Date,
  measure_type: MeasureData['measure_type'],
) => {
  return prisma.measure.findFirst({
    where: {
      customer: {
        customer_code,
      },
      measure_datetime: {
        gte: new Date(
          measure_datetime.getFullYear(),
          measure_datetime.getMonth(),
          1,
        ),
        lt: new Date(
          measure_datetime.getFullYear(),
          measure_datetime.getMonth() + 1,
          1,
        ),
      },
      measure_type,
    },
  });
};

export const createMeasure = async (measureData: MeasureData) => {
  return prisma.measure.create({
    data: measureData,
  });
};
