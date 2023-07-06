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
  updatePatientById(id: number, updates: Partial<PatientReq>): Promise<PatientReq>;
  deletePatient(id: number): Promise<void>;
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

  public async updatePatientById(id: number, updates: Partial<PatientReq>): Promise<PatientReq> {
    try {
      const exitsPatient = await this.patientRepository.getPatientById(id);
      if(!exitsPatient){
        throw new RecordNotFoundError()
    }
    const updatePatient = {...exitsPatient, ...updates}
    this.patientRepository.updatePatientById(id,updatePatient)
    return updatePatient
    } catch (error) {
      logger.error("Failed to Update patient from service");
      throw new GetAllError("Failed Updating patients from Service...");
    }
  }

  public async deletePatient(id: number): Promise<void> {
    try {
      const getPatients = await this.patientRepository.getPatientById(id);
      if(!getPatients){
        throw new RecordNotFoundError()
      }
      await this.patientRepository.deletePatient(id)
    } catch (error) {
      logger.error("Failed to delete patient from service");
      throw new GetAllError("Failed deleting patients from Service...");
    }
  }
}
