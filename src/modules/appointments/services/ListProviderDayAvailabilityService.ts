import { injectable, inject } from 'tsyringe';
import { getHours } from 'date-fns';

// import AppError from '@shared/errors/AppError';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequestDTO {
    provider_id: string;
    year: number;
    month: number;
    day: number;
}

type IResponse = Array<{
    hour: number;
    available: boolean;
}>;

@injectable()
class ListProviderDayAvailability {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,
    ) {}

    public async execute({
        provider_id,
        year,
        month,
        day,
    }: IRequestDTO): Promise<IResponse> {
        const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
            {
                provider_id,
                year,
                month,
                day,
            },
        );

        const hourStart = 8;

        const eachHourArray = Array.from(
            { length: 10 },
            (_, index) => index + hourStart,
        );

        const availability = eachHourArray.map(hour => {
            const hasAppointmentInHour = appointments.find(
                appointment => getHours(appointment.date) === hour,
            );

            return {
                hour,
                available: !hasAppointmentInHour,
            };
        });

        return availability;
    }
}

export default ListProviderDayAvailability;
