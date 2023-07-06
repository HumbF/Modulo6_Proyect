import {
  DoctorCreationError,
  DoctorDeleteError,
  DoctorUpdateError,
  RecordNotFoundError,
  GetAllError,
} from "../../../utils/customErrors";
import logger from "../../../utils/logger";
import { AppointmentReq, Appointment, AppointmentResDB } from "./model";
import { AppointmentRepository } from "./repository";
import { DoctorRepository } from "../doctores/repository";
import { Doctor } from "../doctores/model";

export interface AppointmentService {
  getAllAppointments(): Promise<Appointment[]>;
  createAppointment(patientReq: AppointmentReq): Promise<Appointment>;
  getAppointmentById(id: number): Promise<Appointment>;
  updateAppointmentById(id: number, updates: Partial<AppointmentReq>): Promise<AppointmentReq>;
  deleteAppointmentById(id: number): Promise<void>

}

export class AppointmentServiceImpl implements AppointmentService {
  private appointmentRepository: AppointmentRepository;
  private doctorRepository: DoctorRepository;

  constructor(
    appointmentRepository: AppointmentRepository,
    doctorRepository: DoctorRepository
  ) {
    this.appointmentRepository = appointmentRepository;
    this.doctorRepository = doctorRepository;
  }

  public async getAllAppointments(): Promise<Appointment[]> {
    try {
      const patients = await this.appointmentRepository.getAllAppointment();
      return patients;
    } catch (error) {
      logger.error(error);
      throw new GetAllError(
        "Failed getting all appointments from service"
      );
    }
  }

  public async createAppointment(
    appointmentReq: AppointmentReq
  ): Promise<Appointment> {
    try {
      const appointmentDb = await this.appointmentRepository.createAppointment(
        appointmentReq
      );
      const doctor = await this.doctorRepository.getDoctorById(
        appointmentDb.id_doctor
      );
      const appointment: Appointment = mapAppointment(appointmentDb, doctor);
      return appointment;
    } catch (error) {
      logger.error(error);
      throw new GetAllError(
        `Failed to create appointment dubt: ${error}`,
        " appointment creation"
      );
    }
  }

  public async getAppointmentById(id: number): Promise<Appointment> {
    try {
      const appointmentDb = await this.appointmentRepository.getAppointmentById(
        id
      );
      const doctor = await this.doctorRepository.getDoctorById(
        appointmentDb.id_doctor
      );
      const appointment: Appointment = mapAppointment(appointmentDb, doctor);
      return appointment;
    } catch (error) {
      logger.error("Failed to get appointment from service");
      throw new GetAllError("Failed to get Appointment by Id");
    }
  }

  public async updateAppointmentById(id: number, updates:Partial<AppointmentReq>): Promise<AppointmentReq> {
    try {
        const existAppointment = await this.appointmentRepository.getAppointmentById(id);
        if(!existAppointment){
            throw new RecordNotFoundError()
        }
       
        const updateAppointment = {...existAppointment, ...updates}
        this.appointmentRepository.updateAppointmentById(id,updateAppointment)
        return updateAppointment
    } catch (error) {
      logger.error("Failed to get appointment from service");
      throw new GetAllError("Failed to get Appointment by Id");
    }
  }

  public async deleteAppointmentById(id: number): Promise<void> {
    try {
      const appointmentDb = await this.appointmentRepository.getAppointmentById(id);
      if(!appointmentDb){
        throw new RecordNotFoundError()
    }
     await this.appointmentRepository.deleteAppointmentById(id);
      
    } catch (error) {
      logger.error("Failed to delete appointment from service");
      throw new GetAllError("Failed to get Appointment by Id");
    }
  }



}

function mapAppointment(
  appointmentDb: AppointmentResDB,
  doctor: Doctor
): Appointment {
  const appointment: Appointment = {
    identificacion_paciente: appointmentDb.identificacion_paciente,
    especialidad: appointmentDb.especialidad,
    doctor: `${doctor.nombre} ${doctor.apellido}`,
    consultorio: doctor.consultorio,
    horario: appointmentDb.horario,
  };
  return appointment;
}
