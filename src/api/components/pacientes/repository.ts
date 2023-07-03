import { db } from "../../../config/database"
import { Patient, PatientReq,  } from "./model"
import logger from '../../../utils/logger'
import { DoctorCreationError,  GetAllError,  PatientGetAllError,  RecordNotFoundError } from "../../../config/customErrors"

export class PatientRepository {

    public async createPatient(patient: PatientReq): Promise<Patient> {
        try {
            const [createdPatient] =  await db('pacientes').insert(patient).returning('*') 
            return createdPatient
        } catch (error) {
            logger.error(error)
            throw new GetAllError(`Failed to create patient dubt: ${error}`)
        }
    }

    public async getAllPatients(): Promise<Patient[]> {
        try {
            return  db.select('*').from('pacientes')
        } catch (error) {
            throw new GetAllError("Action not Performed, get all patients failed")
        }
    }

    public async getPatientById(id: number): Promise<Patient> {
        try{
            const patient = await db('pacientes').where({ id_paciente: id }).first()
            return patient
        } catch (error){
            logger.error( `Failed get patient by id in repository1, ${error}`)
            throw new GetAllError("Failed getting Patients in Repository")
        }
    }
}