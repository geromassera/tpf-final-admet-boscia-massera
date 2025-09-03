import { Appointment } from "../models/appointments.js";
import { Op, fn, col, where, literal } from "sequelize";

export const validateString = (str, minLength, maxLength) => {
  if (minLength && str.length < minLength) return false;
  else if (maxLength && str.length > maxLength) return false;

  return true;
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (
  password,
  minLength,
  maxLength,
  needsUppercase,
  needsNumber
) => {
  if (minLength && password.length < minLength) return false;
  else if (maxLength && password.length > maxLength) return false;
  else if (needsUppercase && !/[A-Z]/.test(password)) return false;
  else if (needsNumber && !/\d/.test(password)) return false;

  return true;
};

export const hasConflictingAppointment = async (barber_id, date, time) => {
  if (!barber_id || !date || !time) return false;

  const conflictingAppointment = await Appointment.findOne({
    where: {
      barber_id,
      appointment_date: date,
      appointment_time: time,
    },
  });

  return !!conflictingAppointment; 
};

export function isPastDate(dateStr) {
  const hoy = new Date();
  const fecha = new Date(dateStr);
  hoy.setHours(0, 0, 0, 0);
  fecha.setHours(0, 0, 0, 0);
  return fecha < hoy;
}

export function isClosedDay(dateStr) {
  const fecha = new Date(dateStr);
  const dia = fecha.getDay(); 
  return dia === 0;
}

export function isValidHour(timeStr) {
  const [hora, minutos] = timeStr.split(":").map(Number);
  return hora >= 10 && (hora < 19 || (hora === 19 && minutos === 0));
}

export const actualizarEstadosTurnos = async () => {
  const ahora = new Date().toISOString();

  await Appointment.update(
    { status: "Terminado" },
    {
      where: {
        status: "Asignado",
        [Op.and]: literal(
          `datetime(appointment_date || ' ' || appointment_time) < '${ahora}'`
        ),
      },
    }
  );

  await Appointment.update(
    { status: "Cancelado" },
    {
      where: {
        status: "Pendiente",
        [Op.and]: literal(
          `datetime(appointment_date || ' ' || appointment_time) < '${ahora}'`
        ),
      },
    }
  );
};
