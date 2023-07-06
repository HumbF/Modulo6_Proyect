import { Appointment } from "./model";
import { Request, Response } from "express";
import { AppointmentService } from "./service";
import logger from "../../../utils/logger";
import {
  DoctorCreationError,
  DoctorDeleteError,
  DoctorGetAllError,
  DoctorUpdateError,
  RecordNotFoundError,
  GetAllError,
} from "../../../utils/customErrors";
import createPatientShecma from "./validations/cita.validations";

export interface AppointmentController {
  getAllAppointment(req: Request, res: Response): void;
  createAppointment(req: Request, res: Response): void;
  getAppointmentById(req: Request, res: Response): void;
  updateAppointmentById(req: Request, res: Response): void;
}

export class AppointmentControllerImpl implements AppointmentController {
  private appointmentService: AppointmentService;

  constructor(appointmentService: AppointmentService) {
    this.appointmentService = appointmentService;
  }
  /////////////////////////////////////////////
  public async getAllAppointment(req: Request, res: Response): Promise<void> {
    try {
      const patients = await this.appointmentService.getAllAppointments();

      res.status(200).json(patients);
    } catch (error) {
      logger.error(error);
      res.status(400).json({ message: "Error getting all appointments" });
    }
  }
  ///////////////////////////////////////////////
  public createAppointment(req: Request, res: Response): void {
    const {error, value} = createPatientShecma.validate(req.body)
    
    if(error){
      res.status(400).json({message: error.details[0].message})
    }else{
      this.appointmentService.createAppointment(value).then(
        (appointment) => {
          res.status(201).json(appointment);
        },
        (error) => {
          logger.error(error);
          if (error instanceof DoctorCreationError) {
            res.status(400).json({
              error_name: error.name,
              message: "Failed Creating appointment",
            });
          } else {
            res.status(400).json({
              message: "Internal Server Error",
            });
          }
        }
      );
    }
    
  }
///////////////////////////////////////
  public async getAppointmentById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        throw new Error("Id must be a number");
      }
      const appointment = await this.appointmentService.getAppointmentById(id);
      if (appointment) {
        res.status(200).json(appointment);
      } else {
        throw new RecordNotFoundError();
      }
    } catch (error) {
      logger.error(error);
      if (error instanceof RecordNotFoundError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: "Failed to retrieve patient" });
      }
    }
  }
  ////////////////////////////////////////////////

  public async updateAppointmentById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const appointmentReq = req.body
      const appointment = await this.appointmentService.updateAppointmentById(id, appointmentReq);
      if (appointment) {
        res.status(200).json(appointment);
      } else {
        throw new GetAllError("Failed to get Appointment by Id");
      }
    } catch (error) {
      logger.error(error);
      if (error instanceof RecordNotFoundError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: "Failed to update patient" });
      }
    }
  }
}
