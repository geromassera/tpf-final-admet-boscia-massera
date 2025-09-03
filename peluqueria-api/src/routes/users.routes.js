import { Router } from "express";
import {
  findUsers,
  findUserById,
  CreateUser,
  updateUser,
  DeleteUser,
  assignBarberRole,
  revertToCustomerRole,
  assignAdminRole,
} from "../services/users.services.js";

const router = Router();

router.get("/users", findUsers);
router.get("/users/:id", findUserById);
router.post("/users", CreateUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", DeleteUser);
router.put("/users/:id/barber", assignBarberRole);
router.put("/users/:id/customer", revertToCustomerRole);
router.put("/users/:id/admin", assignAdminRole);

export default router;
