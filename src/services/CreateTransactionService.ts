import { getCustomRepository, getRepository } from 'typeorm';

import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}
class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    if (!title || !type || !value || !category) {
      throw new AppError('Fill in title, value, type and category');
    }

    if (type !== 'outcome' && type !== 'income') {
      throw new AppError('Invalide type');
    }

    if (value < 0) {
      throw new AppError('Invalide value');
    }

    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const { total: balance } = await transactionsRepository.getBalance();

    if (type === 'outcome' && value > balance) {
      throw new AppError('Balance is not enough to this operation');
    }

    const categoriesRepository = getRepository(Category);

    let categoryTransaction = await categoriesRepository.findOne({
      where: { title: category },
    });

    if (!categoryTransaction) {
      categoryTransaction = categoriesRepository.create({ title: category });
      await categoriesRepository.save(categoryTransaction);
    }

    const transaction = transactionsRepository.create({
      title,
      type,
      value,
      category: categoryTransaction,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
