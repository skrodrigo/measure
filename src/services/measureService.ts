import { v4 as uuidv4 } from 'uuid'; // Importa a biblioteca para gerar UUID
import {
  findExistingMeasure,
  createMeasure,
} from '../repositories/measureRepository';
import { MeasureData } from '../models/measureModel';

// Define um erro personalizado
class MeasureError extends Error {
  public code: string;
  public statusCode: number;

  constructor(code: string, message: string, statusCode: number) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
  }
}

export const handleUploadMeasure = async (
  image: string,
  customer_code: string,
  measure_datetime: string,
  measure_type: 'WATER' | 'GAS',
) => {
  const measureDate = new Date(measure_datetime);

  // Verifica se já existe uma leitura para o mês atual
  const existingMeasure = await findExistingMeasure(
    customer_code,
    measureDate,
    measure_type,
  );

  if (existingMeasure) {
    throw new MeasureError('DOUBLE_REPORT', 'Leitura do mês já realizada', 409);
  }

  // Cria uma nova leitura
  const measureData: MeasureData = {
    measure_uuid: uuidv4(), // Gera um UUID para a medida
    measure_datetime: measureDate,
    measure_type,
    image_url: '', // URL da imagem (a ser definida)
    measure_value: undefined, // Valor numérico (a ser definido)
    customerId: customer_code, // Conecta o cliente pelo código
  };

  return await createMeasure(measureData);
};
