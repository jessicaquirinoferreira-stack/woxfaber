/**
 * Pure acoustic and pro audio engineering utilities
 */

export interface SplCalculationResult {
  distanceMeters: number;
  initialSpl1m: number;
  attenuationDb: number;
  perceivedSpl: number;
  safetyRating: 'confortavel' | 'potente' | 'impacto_show' | 'extremo_requer_epi';
  safetyDescription: string;
}

export function calculateSplAtDistance(
  spl1m: number,
  distanceMeters: number
): SplCalculationResult {
  const safeDistance = Math.max(1, distanceMeters);
  const attenuationDb = 20 * Math.log10(safeDistance);
  const perceivedSpl = Math.max(0, Math.round((spl1m - attenuationDb) * 10) / 10);

  let safetyRating: SplCalculationResult['safetyRating'] = 'confortavel';
  let safetyDescription = 'Nível ideal para audição prolongada com clareza cristalina.';

  if (perceivedSpl >= 115) {
    safetyRating = 'extremo_requer_epi';
    safetyDescription = 'Pressão sonora devastadora de frente de palco. Recomendado monitoramento de exposição.';
  } else if (perceivedSpl >= 102) {
    safetyRating = 'impacto_show';
    safetyDescription = 'Impacto físico e dinâmico de alta performance para shows ao vivo e grandes templos.';
  } else if (perceivedSpl >= 88) {
    safetyRating = 'potente';
    safetyDescription = 'Excelente inteligibilidade da voz e peso de instrumentos em toda a extensão do ambiente.';
  }

  return {
    distanceMeters: safeDistance,
    initialSpl1m: spl1m,
    attenuationDb: Math.round(attenuationDb * 10) / 10,
    perceivedSpl,
    safetyRating,
    safetyDescription,
  };
}

export function calculateDelayMs(
  distanceMeters: number,
  tempCelsius = 20
): number {
  const speedOfSound = 331.3 + 0.606 * tempCelsius;
  const delaySec = Math.max(0, distanceMeters) / speedOfSound;
  return Math.round(delaySec * 1000 * 100) / 100; // millisecond with 2 decimal precision
}

export function calculatePowerHeadroom(
  rmsWatts: number,
  peakWatts: number
): number {
  if (rmsWatts <= 0 || peakWatts <= 0) return 0;
  const ratio = peakWatts / rmsWatts;
  return Math.round(10 * Math.log10(ratio) * 10) / 10;
}

export function validateLeadForm(input: {
  name: string;
  email: string;
  phone?: string;
}): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!input.name || input.name.trim().length < 3) {
    errors.name = 'O nome deve conter pelo menos 3 caracteres.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!input.email || !emailRegex.test(input.email.trim())) {
    errors.email = 'Informe um endereço de e-mail corporativo válido.';
  }

  if (input.phone && input.phone.trim().length > 0) {
    const cleanPhone = input.phone.replace(/\D/g, '');
    if (cleanPhone.length < 8) {
      errors.phone = 'Informe um número com ao menos 8 dígitos ou deixe em branco.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
