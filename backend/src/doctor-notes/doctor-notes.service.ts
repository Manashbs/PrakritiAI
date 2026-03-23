import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class DoctorNotesService {
    constructor(private prisma: PrismaService) {}

    private async getPractitionerProfile(userId: string) {
        const p = await this.prisma.practitionerProfile.findUnique({ where: { userId } });
        if (!p) throw new NotFoundException('Practitioner profile not found');
        return p;
    }

    // Doctor saves/updates a note for a patient
    async saveNote(practitionerUserId: string, data: {
        patientId: string;
        content: string;
        isVisibleToPatient?: boolean;
    }) {
        const practitioner = await this.getPractitionerProfile(practitionerUserId);

        return this.prisma.doctorNote.create({
            data: {
                patientId: data.patientId,
                practitionerId: practitioner.id,
                content: data.content,
                isVisibleToPatient: data.isVisibleToPatient ?? true,
            }
        });
    }

    // Doctor retrieves all their notes for a specific patient
    async getNotesForPatient(practitionerUserId: string, patientId: string) {
        const practitioner = await this.getPractitionerProfile(practitionerUserId);

        return this.prisma.doctorNote.findMany({
            where: {
                practitionerId: practitioner.id,
                patientId,
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    // Patient reads all notes left by any doctor (where isVisibleToPatient = true)
    async getPatientNotes(patientId: string) {
        return this.prisma.doctorNote.findMany({
            where: {
                patientId,
                isVisibleToPatient: true,
            },
            include: {
                practitioner: {
                    include: { user: { select: { name: true } } }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
}
