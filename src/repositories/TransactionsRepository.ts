import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const { income } = await this.createQueryBuilder('income')
      .select('SUM(value)', 'income')
      .where('type = :id', { id: 'income' })
      .getRawOne();

    const { outcome } = await this.createQueryBuilder('outcome')
      .select('SUM(value)', 'outcome')
      .where('type = :id', { id: 'outcome' })
      .getRawOne();

    return { income, outcome, total: income - outcome };
  }
}

export default TransactionsRepository;
