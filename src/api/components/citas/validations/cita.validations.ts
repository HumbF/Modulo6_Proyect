import Joi from "joi";
import { AppointmentReq } from "../model";

const createPatientShecma = Joi.object({
    identificacion_paciente: Joi.string(),
    especialidad: Joi.string().required(),
    id_doctor: Joi.number().integer().required(),
    horario: Joi.string()
})

export default createPatientShecma