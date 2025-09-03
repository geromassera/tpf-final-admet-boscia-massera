import { Router } from "express";
import {
  findAppointments,
  findAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  assignAppoinment,
  cancelAppointment,
  customerCancelAppointment,
  findAppointmentsByCustomer,
} from "../services/appointments.services.js";

const router = Router();

router.get("/appointments", (req, res) => {
  if (req.query.unassigned === "true") {
    return findUnassignedAppointments(req, res);
  }
  return findAppointments(req, res);
});

router.get("/appointments/:id", findAppointmentById);
router.post("/appointments", createAppointment);
router.put("/appointments/:id", updateAppointment);
router.delete("/appointments/:id", deleteAppointment);
router.put("/appointments/:id/assign", assignAppoinment);
router.put("/appointments/:id/cancel", cancelAppointment);
router.put("/appointments/:id/customer-cancel", customerCancelAppointment);
router.get("/appointments/customer/:customer_id", findAppointmentsByCustomer);
export default router;
