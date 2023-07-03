import {GetAllError, DoctorCreationError, DoctorDeleteError, DoctorUpdateError, RecordNotFoundError } from "../../../config/customErrors"
import logger from "../../../utils/logger"
import { Doctor, DoctorReq } from "./model"
import { DoctorRepository } from "./repository"


export interface DoctorService {
    getAllDoctors(): Promise<Doctor[]>
    createDoctor(doctorReq: DoctorReq): Promise<Doctor>
    getDoctorById(id: number): Promise<Doctor>
    updateDoctor(id: number, updates:Partial<Doctor>): Promise<Doctor>
    deleteDoctor(id: number): Promise<void>
}

export class DoctorServiceImpl implements DoctorService {
    private doctorRepository: DoctorRepository

    constructor(doctorRepository: DoctorRepository){
        this.doctorRepository = doctorRepository
    }

    public async getAllDoctors(): Promise<Doctor[]> {
        try{
            const doctors = await this.doctorRepository.getAllDoctors()
            return doctors
        }catch (error){
            //logger.error(error)
            throw new GetAllError("Failed getting all Doctors from service", "Doctors")
        }
       
    }
    
    public   createDoctor(doctorReq: DoctorReq): Promise<Doctor> {
        try{
            return this.doctorRepository.createDoctor(doctorReq)
        } catch (error){
            throw new DoctorCreationError("Failed to create doctor from service") 
        }
    }

    public async getDoctorById(id: number): Promise<Doctor> {
        try { 
            const doctorById = await this.doctorRepository.getDoctorById(id)
            return doctorById
        } catch (error) {
            logger.error('Failed to get doctor from service')
            throw new GetAllError("Failed Getting Doctor from Service")
        }
    }

    public  async updateDoctor(id: number, updates: Partial<DoctorReq>): Promise<Doctor> {
        try {
            const existDoctor =  await this.doctorRepository.getDoctorById(id)
            if (!existDoctor) {
                throw new RecordNotFoundError()
            }
            const updateDoctor = {...existDoctor, ...updates}
            this.doctorRepository.updateDoctor(id, updateDoctor)
            return updateDoctor
        } catch (error) {
            logger.error('Failed to update doctor from service')
            throw new GetAllError("Update not Accomplished from Service")
        }
    }

    public async deleteDoctor(id: number): Promise<void> {
        try {
            const existDoctor =  await this.doctorRepository.getDoctorById(id)
            if (!existDoctor) {
                throw new RecordNotFoundError()
            }
            await this.doctorRepository.deleteDoctor(id)
        } catch (error) {
            logger.error('Failed to delete doctor from service')
            throw new GetAllError("Failed deleting doctor from Service")
        }
    }
}