import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { VisitorsController } from './visitors.controller';
import { VisitorsService } from './visitors.service';
import { Visitor } from './models/visitor.model';

@Module({
  imports: [SequelizeModule.forFeature([Visitor])],
  controllers: [VisitorsController],
  providers: [VisitorsService],
})
export class VisitorsModule {}