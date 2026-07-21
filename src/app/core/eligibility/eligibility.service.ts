import { Injectable } from '@angular/core';
import {
  DEFAULT_ELIGIBILITY_CONFIG,
  EligibilityConfig,
  EligibilityInput,
  EligibilityResult,
  estimateMonthlyRepayment,
  scoreEligibility,
} from './eligibility-scoring';

/**
 * Front door for eligibility. Currently runs the ported Caltos scorer in-browser;
 * when a real backend exists, swap the implementation to an HTTP call without
 * changing any caller.
 */
@Injectable({ providedIn: 'root' })
export class EligibilityService {
  score(input: EligibilityInput, config: EligibilityConfig = DEFAULT_ELIGIBILITY_CONFIG): EligibilityResult {
    return scoreEligibility(input, config);
  }

  monthlyRepayment(
    amount: number,
    tenorMonths: number,
    ratePercent: number,
    model: 'Flat Rate' | 'Reducing Balance' | 'Percentage Based' = 'Flat Rate',
  ): number {
    return estimateMonthlyRepayment(amount, tenorMonths, ratePercent, model);
  }
}
