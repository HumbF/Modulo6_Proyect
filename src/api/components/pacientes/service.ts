import {
  GetAllError,
  DoctorCreationError,
  DoctorDeleteError,
  DoctorUpdateError,
  RecordNotFoundError,
} from "../../../utils/customErrors";
import logger from "../../../utils/logger";
import { PatientReq, Patient } from "./model";
import { PatientRepository } from "./repository";

export interface PatientService {
  getAllPatients(): Promise<Patient[]>;
  createPatient(patientReq: PatientReq): Promise<Patient>;
  getPatientById(id: number): Promise<Patient>;
}

export class PatientServiceImpl implements PatientService {
  private patientRepository: PatientRepository;

  constructor(patientRepository: PatientRepository) {
    this.patientRepository = patientRepository;
  }

  public async getAllPatients(): Promise<Patient[]> {
    try {
      const patients = await this.patientRepository.getAllPatients();
      return patients;
    } catch (error) {
      logger.error(error);
      throw new GetAllError("Failed getting all patients from service");
    }
  }

  public async createPatient(patientReq: PatientReq): Promise<Patient> {
    try {
      const createPat = await this.patientRepository.createPatient(patientReq);
      return createPat;
    } catch (error) {
      logger.error(error);
      throw new GetAllError("Failed to create patient from service");
    }
  }

  public async getPatientById(id: number): Promise<Patient> {
    try {
      const getPatients = await this.patientRepository.getPatientById(id);
      return getPatients;
    } catch (error) {
      logger.error("Failed to get patient from service");
      throw new GetAllError("Failed getting patients from Service...");
    }
  }
}
