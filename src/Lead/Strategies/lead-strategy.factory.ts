import { Injectable } from '@nestjs/common';
import { ILeadStrategy } from './lead.strategy.interface';

@Injectable()
export class LeadStrategyFactory {
  constructor(private strategies: ILeadStrategy[]) {}

  getStrategy(role: string): ILeadStrategy {
    const strategy = this.strategies.find((s) => s.role === role);
    if (!strategy) throw new Error(`No strategy found for role: ${role}`);

    return strategy;
  }
}
