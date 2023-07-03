import { db } from "../../../config/database";
import { Appointment, AppointmentReq, AppointmentResDB } from "./model";
import logger from "../../../utils/logger";
import {
  DoctorCreationError,
  PatientGetAllError,
  RecordNotFoundError,
  GetAllError,
} from "../../../utils/customErrors";

export class AppointmentRepository {
  public async createAppointment(
    appointment: AppointmentReq
  ): Promise<AppointmentResDB> {
    try {
      const [createdAppointment] = await db("citas")
        .insert(appointment)
        .returning("*");
      return createdAppointment;
    } catch (error) {
      throw new GetAllError(
        `Failed to create appointment dubt: ${error}`,
        " appointment"
      );
    }
  }
  /////////////////////////////////////////////////////
  public async getAllAppointment(): Promise<Appointment[]> {
    try {
      return db.select("*").from("citas1");
    } catch (error) {
      throw new GetAllError(
        "Failed getting all appointments from repository",
        "appointment"
      );
    }
  }
  //////////////////////////////////////////////////////
  public async getAppointmentById(id: number): Promise<AppointmentResDB> {
    try {
      const appointment = await db("citas").where({ id_cita: id }).first();
      return appointment;
    } catch (error) {
      logger.error("Failed get appointment by id in repository", { error });
      throw new GetAllError("Failed getting appointments by Id rep");
    }
  }
}
