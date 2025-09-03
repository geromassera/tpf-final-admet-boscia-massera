import { Appointment } from "../models/appointments.js";
import { hasConflictingAppointment } from "../helpers/validations.js";
import { actualizarEstadosTurnos } from "../helpers/validations.js";

export const findAppointments = async (req, res) => {
  await actualizarEstadosTurnos();
  const appointments = await Appointment.findAll();
  res.json(appointments);
};

export const findAppointmentById = async (req, res) => {
  const { id } = req.params;

  await actualizarEstadosTurnos();
  const appointment = await Appointment.findByPk(id);

  if (!appointment) {
    return res.status(404).send({ message: "Appointment not found" });
  }

  res.json(appointment);
};

export const createAppointment = async (req, res) => {
  try {
    const {
      appointment_date,
      appointment_time,
      service,
      customer_id,
      customer_name,
    } = req.body;

    console.log("Datos recibidos:", req.body);

    if (!appointment_date || !appointment_time || !service) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newAppointment = await Appointment.create({
      appointment_date,
      appointment_time,
      service,
      customer_id,
      customer_name,
    });

    res.json(newAppointment);
  } catch (error) {
    console.error("Error al crear turno:", error);
    res
      .status(500)
      .json({ message: error.message || "Error interno del servidor" });
  }
};

export const updateAppointment = async (req, res) => {
  const { id } = req.params;
  const { appointment_date, appointment_time, service, barber_id } = req.body;

  const appointment = await Appointment.findByPk(id);

  if (!appointment) {
    return res.status(404).send({ message: "User not found" });
  }

  await appointment.update({
    appointment_date,
    appointment_time,
    service,
    barber_id,
  });
  res.json(appointment);
};

export const deleteAppointment = async (req, res) => {
  const { id } = req.params;
  const appointment = await Appointment.findByPk(id);

  if (!appointment) {
    return res.status(404).send({ message: "User not found" });
  }

  await appointment.destroy();
  res.send(`Appointment ${id} deleted`);
};

export const assignAppoinment = async (req, res) => {
  const { id } = req.params;
  const { barber_id } = req.body;

  if (!barber_id) {
    return res.status(400).json({ message: "ID del barbero faltante" });
  }

  const appointment = await Appointment.findByPk(id);

  if (!appointment) {
    return res.status(404).json({ message: "Turno no encontrado" });
  }

  if (appointment.barber_id !== null || appointment.status !== "Pendiente") {
    return res
      .status(400)
      .json({ message: "El turno ya está asignado o no está disponible" });
  }

  const conflict = await hasConflictingAppointment(
    barber_id,
    appointment.appointment_date,
    appointment.appointment_time
  );

  if (conflict) {
    return res
      .status(400)
      .json({ message: "Ya tenés un turno asignado en ese horario" });
  }

  appointment.barber_id = barber_id;
  appointment.status = "Asignado";
  await appointment.save();

  res.json({ message: "Turno asignado correctamente" });
};

export const cancelAppointment = async (req, res) => {
  const { id } = req.params;
  const appointment = await Appointment.findByPk(id);

  if (!appointment) {
    return res.status(404).json({ message: "Turno no encontrado" });
  }

  if (appointment.barber_id === null || appointment.status !== "Asignado") {
    return res.status(400).json({ message: "El turno no está asignado" });
  }

  appointment.barber_id = null;
  appointment.status = "Pendiente";
  await appointment.save();

  res.json({ message: "Turno cancelado" });
};

export const customerCancelAppointment = async (req, res) => {
  const { id } = req.params;
  const appointment = await Appointment.findByPk(id);

  if (!appointment) {
    return res.status(404).json({ message: "Turno no encontrado" });
  }

  appointment.status = "Cancelado";
  appointment.barber_id = null;
  await appointment.save();

  res.json({ message: "Turno cancelado correctamente" });
};

export const findAppointmentsByCustomer = async (req, res) => {
  const { customer_id } = req.params;

  if (!customer_id) {
    return res.status(400).json({ message: "Falta el ID del cliente" });
  }

  try {
    await actualizarEstadosTurnos();

    const appointments = await Appointment.findAll({
      where: { customer_id },
    });

    res.json(appointments);
  } catch (error) {
    console.error("Error al obtener turnos del cliente:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
