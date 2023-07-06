import { Patient } from "./model";
import { Request, Response } from "express";
import { PatientService } from "./service";
import logger from "../../../utils/logger";
import {
  DoctorCreationError,
  DoctorDeleteError,
  DoctorGetAllError,
  DoctorUpdateError,
  GetAllError,
  RecordNotFoundError,
} from "../../../utils/customErrors";

export interface PatientController {
  getAllPatient(req: Request, res: Response): void;
  createPatient(req: Request, res: Response): void;
  getPatientById(req: Request, res: Response): void;
  updatePatientById(req: Request, res: Response): Promise<void>;
  deletePatient(req: Request, res: Response): Promise<void>;
}

export class PatientControllerImpl implements PatientController {
  private patientService: PatientService;

  constructor(patientService: PatientService) {
    this.patientService = patientService;
  }
  /////////////////////////////Get All Patients /////////////////
  public async getAllPatient(req: Request, res: Response): Promise<void> {
    try {
      const patients = await this.patientService.getAllPatients();
      res.status(200).json(patients);
    } catch (error) {
      logger.error(error);
      res.status(400).json({ message: "Error getting all patients" });
    }
  }

    /////////////////////////////Create  Patients /////////////////

  public createPatient(req: Request, res: Response): void {
    const patientReq = req.body;
    this.patientService.createPatient(patientReq).then(
      (patient) => {
        res.status(201).json(patient);
      },
      (error) => {
        logger.error(error);
        if (error instanceof DoctorCreationError) {
          res.status(400).json({
            error_name: error.name,
            message: "Failed Creating a patient",
          });
        } else {
          res.status(400).json({
            message: "Internal Server Error",
          });
        }
      }
    );
  }
  /////////////////////////////Get Patients by Id /////////////////

  public async getPatientById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        throw new Error("Id must be a number");
      }
      const patient = await this.patientService.getPatientById(id);
      if (patient) {
        res.status(200).json(patient);
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


    /////////////////////////////Update Patients by Id /////////////////
    public async updatePatientById(req: Request, res: Response): Promise<void> {
      try {
        const id = parseInt(req.params.id);
        const patientReq = req.body
        const patient = await this.patientService.updatePatientById(id, patientReq)
             
        if (patient) {
          res.status(200).json(patient);
        } else {
          throw new GetAllError("Failed to Update Patient from Controller");
        }
      } catch (error) {
        logger.error(error);
        if (error instanceof RecordNotFoundError) {
          res.status(400).json({ error: error.message });
        } else {
          res.status(400).json({ error: "Failed to retrieve patient Updates" });
        }
      }
    }
   
    /////////////////////////////Delete Patients by Id /////////////////
    public async deletePatient(req: Request, res: Response): Promise<void> {
      try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
          throw new Error("Id must be a number");
        }
        await this.patientService.deletePatient(id);
        res.status(200).json({message: "Patient was deleted successfully"});
       
      } catch (error) {
        logger.error(error);
        if (error instanceof RecordNotFoundError) {
          res.status(400).json({ error: error.message });
        } else {
          res.status(400).json({ error: "Failed to retrieve patient" });
        }
      }
    }
}
