import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Int, Context } from '@nestjs/graphql';
import { PointsTransactionsService } from './pointsTransactions.service';
import { GqlAuthAccessGuard } from '../../commons/auth/gql-auth.guard';
import { PointTransaction } from './entities/pointTransaction.entity';
import { IContext } from '../../commons/type/context';

@Resolver()
export class PointsTransactionsResolver {
  constructor(
    private readonly pointsTransactionsService: PointsTransactionsService,
  ) {}
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => PointTransaction)
  createPointTransaction(
    @Args('impUid') impUid: string,
    @Args({ name: 'amount', type: () => Int }) amount: number,
    @Context() context: IContext,
  ) {
    const user = context.req.user;
    return this.pointsTransactionsService.create({
      impUid,
      amount,
      user,
    });
  }
}
