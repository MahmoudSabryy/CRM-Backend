import { Injectable } from '@nestjs/common';
import { IContactStrategy } from './contact.strategy.interface';

@Injectable()
export class ContactStrategyFactory {
  constructor(private strategies: IContactStrategy[]) {}

  getStrategy(role: string): IContactStrategy {
    const strategy = this.strategies.find((s) => s.role === role);

    if (!strategy) throw new Error(`No strategy found for role: ${role}`);

    return strategy;
  }
}
