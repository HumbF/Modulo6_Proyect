import { AppointmentServiceImpl } from "../api/components/citas/service"
import { Appointment, AppointmentReq,AppointmentResDB } from "../api/components/citas/model"
import { AppointmentRepository } from "../api/components/citas/repository"
import { DoctorRepository } from "../api/components/doctores/repository"





describe('AppointmentService', ()=>{
    let appointmentService: AppointmentServiceImpl
    let doctorRepository: DoctorRepository
    let appointmentRepository : AppointmentRepository
    
 
   

    beforeEach(() => {
        appointmentRepository = {
            getAllAppointment: jest.fn(), 
            createAppointment: jest.fn(),
            getAppointmentById: jest.fn(),
            updateAppointmentById: jest.fn()
        }

        appointmentService = new AppointmentServiceImpl( appointmentRepository, doctorRepository )      
    })


    describe('getAllApointments', ()=>{
        it('Should get back all Appointmens from service',async () => {
            const appointmens : Appointment[] = [
                { identificacion_paciente: '1', especialidad: 'Psicologia', doctor: 'Camilo Arted', consultorio: 301, horario: 'Mañana' }
            ];

            (appointmentRepository.getAllAppointment as jest.Mock).mockResolvedValue(appointmens)

            const result = await appointmentService.getAllAppointments()

            expect(appointmentRepository.getAllAppointment).toHaveBeenCalled()
        
            expect(result).toEqual(appointmens)
        })
    })


    describe('createApointments', ()=>{
        it('Should create Appointmens from service',async () => {
            const appointmens : Appointment =
                { identificacion_paciente: '1', especialidad: 'Psicologia', doctor: 'Camilo Arted', consultorio: 301, horario: 'Mañana' };
                const appointment : AppointmentReq = 
                { identificacion_paciente: '1', especialidad: 'Psicologia', id_doctor: 1, horario: 'Mañana' };

            (appointmentRepository.getAllAppointment as jest.Mock).mockResolvedValue(appointment)

            const result = await appointmentService.getAllAppointments()

            expect(appointmentRepository.getAllAppointment).toHaveBeenCalled()
        
            expect(result).toEqual(appointment)
        })
    })

})