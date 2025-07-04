import { Module } from '@nestjs/common';
import { TypeOrmConfigModule } from './config/typeorm.config';
import { UsersModule } from './users/users.module';
//import { User } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [TypeOrmConfigModule, UsersModule, AuthModule],
})
export class AppModule {}
