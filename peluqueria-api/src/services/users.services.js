import { User } from "../models/Users.js";
import {
  validateEmail,
  validatePassword,
  validateString,
} from "../helpers/validations.js";
import bcrypt from "bcrypt";

export const findUsers = async (req, res) => {
  const users = await User.findAll();
  res.json(users);
};

export const findUserById = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByPk(id);

  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }

  res.json(user);
};

export const CreateUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).send({ message: "All fields are required" });
  }

  const user = await User.create({ name, email, password, role });
  res.json(user);
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (!validateString(name)) {
      return res.status(400).json({ message: "Nombre inválido" });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Email inválido" });
    }

    if (password && !validatePassword(password)) {
      return res.status(400).json({ message: "Contraseña inválida" });
    }

    user.name = name;
    user.email = email;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();

    const { password: _, ...userData } = user.toJSON();
    return res.json({ message: "Usuario actualizado", user: userData });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error al actualizar el usuario" });
  }
};

export const DeleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByPk(id);

  if (!user) {
    return res.status(404).send({ message: "Usuario no encontrado" });
  }

  await user.destroy();
  return res.status(200).json({ message: "Usuario eliminado" });
};

export const assignBarberRole = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).send({ message: "Usuario no encontrado" });
    }

    if (user.role === "Admin") {
      return res
        .status(403)
        .json({ message: "No se puede modificar a otros admins." });
    }

    if (user.role === "Barber") {
      return res.status(403).json({ message: "El usuario ya es un barbero" });
    }

    user.role = "Barber";
    await user.save();

    res.json({ message: "Rol actualizado a barber", user });
  } catch (err) {
    res.status(500).send({ message: "Error al actualizar el rol" });
  }
};

export const revertToCustomerRole = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).send({ message: "Usuario no encontrado" });
    }

    if (user.role === "Admin") {
      return res
        .status(403)
        .json({ message: "No se puede modificar a otros admins." });
    }

    if (user.role === "Customer") {
      return res.status(403).json({ message: "El usuario ya es un cliente" });
    }

    user.role = "Customer";
    await user.save();

    res.json({ message: "Rol actualizado a customer", user });
  } catch (err) {
    res.status(500).send({ message: "Error al actualizar el rol" });
  }
};

export const assignAdminRole = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).send({ message: "Usuario no encontrado" });
    }

    if (user.role === "Admin") {
      return res
        .status(403)
        .json({ message: "No se puede modificar a otros admins." });
    }

    user.role = "Admin";
    await user.save();

    res.json({ message: "Rol actualizado a admin", user });
  } catch (err) {
    res.status(500).send({ message: "Error al actualizar el rol" });
  }
};
