import { Request, Response } from "express"
import { AppointmentController,AppointmentControllerImpl } from "../api/components/citas/controller"
import { AppointmentService } from "../api/components/citas/service"
import { Appointment, AppointmentReq,AppointmentResDB } from "../api/components/citas/model"



const mockReq = {} as Request
const mockRes = {} as Response

describe('AppointmentController', ()=>{
    let appointmentService: AppointmentService
    let appointmentController : AppointmentController

    beforeEach(() => {
        appointmentService = {
            getAllAppointments: jest.fn(), 
            createAppointment: jest.fn(),
            getAppointmentById: jest.fn(),
            updateAppointmentById: jest.fn(),
            
        }

        appointmentController = new AppointmentControllerImpl(appointmentService)
        mockRes.status = jest.fn().mockReturnThis()
        mockRes.json = jest.fn().mockReturnThis()
    })


    describe('getAllApointments', ()=>{
        it('Should get back all Appointmens',async () => {
            const appointmens : Appointment[] = [
                { identificacion_paciente: '1', especialidad: 'Psicologia', doctor: 'Camilo Arted', consultorio: 301, horario: 'Mañana' }
            ];

            (appointmentService.getAllAppointments as jest.Mock).mockResolvedValue(appointmens)

            await appointmentController.getAllAppointment(mockReq, mockRes)

            expect(appointmentService.getAllAppointments).toHaveBeenCalled()
            expect(mockRes.json).toHaveBeenCalledWith(appointmens)
            expect(mockRes.status).toHaveBeenCalledWith(200)
        })
    })

    describe('createAllApointments', ()=>{
        it('Should create Appointmens',async () => {
            const appointmensRes : Appointment[] = [
                { identificacion_paciente: '1', especialidad: 'Psicologia', doctor: 'Camilo Arted', consultorio: 301, horario: 'Mañana' }];
            const appointmentReq : AppointmentReq =  { identificacion_paciente: '1', especialidad: 'Psicologia', id_doctor: 1, horario: 'Mañana' };
            (mockReq.body as AppointmentReq) = appointmentReq;

            (appointmentService.createAppointment as jest.Mock).mockResolvedValue(appointmensRes)

            await appointmentController.createAppointment(mockReq, mockRes)

            expect(appointmentService.createAppointment).toHaveBeenCalledWith(appointmentReq)
            expect(mockRes.json).toHaveBeenCalledWith(appointmensRes)
            expect(mockRes.status).toHaveBeenCalledWith(201)
        })
    })

})

