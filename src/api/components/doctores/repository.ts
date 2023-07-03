import { db } from "../../../config/database"
import { Doctor, DoctorReq } from "./model"
import logger from '../../../utils/logger'
import {GetAllError, DoctorCreationError, DoctorDeleteError, DoctorGetAllError, DoctorUpdateError, RecordNotFoundError } from "../../../config/customErrors"

export class DoctorRepository {
    public async createDoctor(doctor: DoctorReq): Promise<Doctor> {
        try {
            const [createdDoctor] =  await db('doctores').insert(doctor).returning('*') // select * from doctores where id_doctor=?
            return createdDoctor
        } catch (error) {
            throw new DoctorCreationError(`Failed to create doctor dubt: ${error}`)
        }
    }
////////////////////////// Get All Doctors ///////////////////
    public async getAllDoctors(): Promise<Doctor[]> {
        try {
            return  db.select('*').from('doctores')
        } catch (error) {
            throw new GetAllError("Failed getting all Doctors from Repository")
        }
    }
////////////////////////// Get Doctor by Id  ///////////////////

    public async getDoctorById(id: number): Promise<Doctor> {
        try{
            const doctor = await db('doctores').where({ id_doctor: id }).first()
            return doctor
        } catch (error){
            logger.error( 'Failed get doctor by id in repository', {error})
            throw new GetAllError("Failed Getting Doctor by id in Repository")
        }
    }
////////////////////////// Update Doctor by Id  ///////////////////

    public async updateDoctor(id: number, updates: Partial<DoctorReq>): Promise<void> {
        try{
            await db('doctores').where({ id_doctor: id }).update(updates)
        } catch (error){
            logger.error( 'Failed updated doctor in repository', {error})
            throw new GetAllError("Update not Accomplished from Repository")
        }
    }

    public async deleteDoctor(id: number): Promise<void> {
        try{
            await db('doctores').where({ id_doctor: id }).del()
        } catch (error){
            logger.error( 'Failed deleting doctor in repository', {error})
            throw new GetAllError("Failed to delete a doctor in Repository")
        }
    }
}

export default{
    DoctorRepository
}