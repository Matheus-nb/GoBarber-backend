// import AppError from '@shared/errors/AppError';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let ListProviderAppointments: ListProviderAppointmentsService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviderAppointments', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        fakeCacheProvider = new FakeCacheProvider();

        ListProviderAppointments = new ListProviderAppointmentsService(
            fakeAppointmentsRepository,
            fakeCacheProvider,
        );
    });

    it('should be able to list the appointments on a specific day', async () => {
        const appointment1 = await fakeAppointmentsRepository.create({
            provider_id: 'provider',
            user_id: 'user',
            date: new Date(2021, 4, 20, 8, 0, 0),
        });

        const appointment2 = await fakeAppointmentsRepository.create({
            provider_id: 'provider',
            user_id: 'user',
            date: new Date(2021, 4, 20, 9, 0, 0),
        });

        const appointment3 = await fakeAppointmentsRepository.create({
            provider_id: 'provider',
            user_id: 'user',
            date: new Date(2021, 4, 20, 14, 0, 0),
        });

        const ListAppointments = await ListProviderAppointments.execute({
            provider_id: 'provider',
            day: 20,
            month: 5,
            year: 2021,
        });

        expect(ListAppointments).toEqual([
            appointment1,
            appointment2,
            appointment3,
        ]);
    });
});
it('should be able to list the appointments on a specific day from cache', async () => {
    await fakeCacheProvider.save(
        'provider-appointments:provider1:2021-5-20',
        '13:00:00',
    );

    const ListAppointments = await ListProviderAppointments.execute({
        provider_id: 'provider1',
        day: 20,
        month: 5,
        year: 2021,
    });

    expect(ListAppointments).toEqual('13:00:00');
});
