import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardsModule } from './apis/boards/boards.module';
import { ProductModule } from './apis/products/products.module';
import { ProductCategoryModule } from './apis/productsCategories/productCategories.module';
import { UsersModule } from './apis/users/users.module';
import { AuthsModule } from './apis/auths/auths.module';
import { PointsTransactionsModule } from './apis/pointsTransactions/pointsTransactions.module';
import { FilesModule } from './apis/files/files.module';
import { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthsModule,
    BoardsModule,
    FilesModule,
    PointsTransactionsModule,
    ProductModule,
    ProductCategoryModule,
    // ProductTagsModule,
    UsersModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/commons/graphql/schema.gql',
      context: ({ req, res }) => ({ req, res }),
    }),

    TypeOrmModule.forRoot({
      type: process.env.DATABASE_TYPE as 'mysql',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DATABASE,
      entities: [__dirname + '/apis/**/*.entity.*'],
      synchronize: true,
      logging: true,
      retryAttempts: 30, // 서버연결시도 횟수
    }),
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      url: 'redis://my-redis:6379',
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
