import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { QueuesModule } from './queues/queues.module';
import { DispatchesModule } from './dispatches/dispatches.module';
import { LocationsModule } from './locations/locations.module';
import { AuthModule } from './auth/auth.module';
import { RoutesModule } from './routes/routes.module';

@Module({
  imports: [UsersModule, VehiclesModule, QueuesModule, DispatchesModule, LocationsModule, AuthModule, RoutesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
