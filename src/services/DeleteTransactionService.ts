import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const transactionToRemove = await transactionsRepository.findOne(id);

    if (!transactionToRemove) {
      throw new AppError('Transaction does not exist');
    }
    await transactionsRepository.remove(transactionToRemove);
  }
}

export default DeleteTransactionService;
