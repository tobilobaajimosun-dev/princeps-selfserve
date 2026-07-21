import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TPipe } from '../../../core/i18n/t.pipe';
import { WizardProgressComponent } from '../wizard-progress.component';
import { ApplicationStateService } from '../../../core/application/application-state.service';
import { Product, RepaymentFrequency, calcFees, productsFor } from '../../../core/products/products';
import { estimateMonthlyRepayment } from '../../../core/eligibility/eligibility-scoring';
import { formatNaira } from '../../../core/money.util';

interface OfferView {
  product: Product;
  amount: number;
  tenorMonths: number;
  monthly: number;
}

@Component({
  selector: 'app-offers',
  imports: [TPipe, WizardProgressComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './offers.component.html',
  styleUrl: './offers.component.css',
})
export class OffersComponent implements OnInit {
  private readonly state = inject(ApplicationStateService);
  private readonly router = inject(Router);

  readonly offers = signal<OfferView[]>([]);
  readonly formatNaira = formatNaira;

  async ngOnInit(): Promise<void> {
    const employment = this.state.employment();
    const salary = this.state.salary();
    const eligibility = this.state.eligibility();
    if (!employment || !salary || !eligibility || eligibility.decision !== 'approved') {
      await this.router.navigateByUrl('/apply/eligibility');
      return;
    }

    const eligibleProducts = productsFor(employment.type, salary.channel);
    const views: OfferView[] = eligibleProducts.map((product) => {
      const amount = Math.min(eligibility.maxEligibleAmount, product.maxAmount);
      const tenor = eligibility.tenorMonths;
      const monthly = estimateMonthlyRepayment(amount, tenor, product.ratePercent, product.interestModel);
      return { product, amount, tenorMonths: tenor, monthly };
    }).filter((v) => v.amount >= v.product.minAmount);

    this.offers.set(views);
  }

  modelKey(m: Product['interestModel']): string {
    if (m === 'Flat Rate') return 'step.offers.model.flat';
    if (m === 'Reducing Balance') return 'step.offers.model.reducing';
    return 'step.offers.model.percent';
  }

  frequencyKey(f: RepaymentFrequency): string {
    return `step.offers.frequency.${f}`;
  }

  pick(o: OfferView): void {
    this.state.setOffer({
      productId: o.product.id,
      productName: o.product.name,
      amount: o.amount,
      tenorMonths: o.tenorMonths,
      ratePercent: o.product.ratePercent,
      interestModel: o.product.interestModel,
      monthlyRepayment: o.monthly,
      fees: calcFees(o.product, o.amount),
    });
    void this.router.navigateByUrl('/apply/terms');
  }
}
