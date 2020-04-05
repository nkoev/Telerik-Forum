import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { BanStatus } from '../../database/entities/ban-status.entity';
import { Repository } from 'typeorm';

export class ScheduledTasks {

  @InjectRepository(BanStatus) private readonly banStatusRepository: Repository<BanStatus>

  @Cron('* 1 0 * * *')
  async handleCron() {
    const banStatuses = await this.banStatusRepository.find({ isBanned: true })
    const dateTime = new Date().getTime()
    banStatuses.forEach(status => {
      if (status.expires.getTime() < dateTime) {
        status.isBanned = false
        this.banStatusRepository.save(status)
      }
    })
  }
}