import { Request, Response } from 'express';
import { z, ZodError } from 'zod';
import { handleUploadMeasure } from '../services/measureService';

// Define o esquema de validação para a requisição
const measureSchema = z.object({
  image: z
    .string()
    .min(1, 'Image is required')
    .refine((val) => val.startsWith('data:'), {
      message: 'Image must be in base64 format',
    }),
  customer_code: z
    .string()
    .min(1, 'Customer code is required')
    .refine(
      (val) =>
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          val,
        ),
      { message: 'Customer code must be a valid UUID' },
    ),
  measure_datetime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  measure_type: z.enum(['WATER', 'GAS']),
});

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

export const uploadMeasure = async (req: Request, res: Response) => {
  try {
    // Valida os dados da requisição
    measureSchema.parse(req.body);

    const { image, customer_code, measure_datetime, measure_type } = req.body;

    // Chama o serviço para processar a medição
    const result = await handleUploadMeasure(
      image,
      customer_code,
      measure_datetime,
      measure_type,
    );
    res.status(200).json({
      image_url: result.image_url,
      measure_value: result.measure_value,
      measure_uuid: result.measure_uuid,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      // Responde com o erro de validação
      return res.status(400).json({
        error_code: 'INVALID_DATA',
        error_description: error.errors.map((e) => e.message).join(', '),
      });
    }

    if (error instanceof MeasureError) {
      // Responde com o erro específico
      return res.status(error.statusCode).json({
        error_code: error.code,
        error_description: error.message,
      });
    }

    // Resposta genérica para erros não tratados
    res.status(500).json({
      error_code: 'INTERNAL_ERROR',
      error_description: 'Erro interno do servidor',
    });
  }
};
