import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AppointmentsScheduler {
    private readonly logger = new Logger(AppointmentsScheduler.name);

    constructor(private prisma: PrismaService) {}

    /**
     * Runs every minute.
     * Auto-completes any SCHEDULED appointment whose startTime is
     * more than 10 minutes in the past (i.e. no one joined in time).
     */
    @Cron(CronExpression.EVERY_MINUTE)
    async autoCompleteStaleAppointments() {
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

        const stale = await this.prisma.appointment.findMany({
            where: {
                status: 'SCHEDULED',
                startTime: { lt: tenMinutesAgo }
            },
            select: { id: true }
        });

        if (stale.length === 0) return;

        const ids = stale.map(a => a.id);

        await this.prisma.appointment.updateMany({
            where: { id: { in: ids } },
            data: { status: 'COMPLETED' }
        });

        this.logger.log(`Auto-completed ${stale.length} stale appointment(s): ${ids.join(', ')}`);
    }
}
