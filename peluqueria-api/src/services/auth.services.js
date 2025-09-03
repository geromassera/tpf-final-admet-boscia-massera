import bcrypt from "bcrypt";
import { User } from "../models/Users.js";
import {
  validateEmail,
  validatePassword,
  validateString,
} from "../helpers/validations.js";

export const registerUser = async (req, res) => {
  const result = validateRegisterUser(req.body);

  if (result.error) return res.status(400).send({ message: result.message });

  const { name, email, password } = req.body;

  const user = await User.findOne({
    where: { email },
  });

  if (user)
    return res
      .status(400)
      .send({ message: "Este email ya se encuentra registrado." });

  const saltRounds = 10;

  const salt = await bcrypt.genSalt(saltRounds);

  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  res.status(201).json({
    user_id: newUser.user_id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    message: "Usuario registrado correctamente",
  });
};

export const loginUser = async (req, res) => {
  const result = validateLoginUser(req.body);

  if (result.error) return res.status(400).send({ message: result.message });

  const { email, password } = req.body;

  const user = await User.findOne({
    where: { email },
  });

  if (!user) return res.status(401).send({ message: "Usuario no existente" });

  const comparison = await bcrypt.compare(password, user.password);

  if (!comparison)
    return res.status(401).send({ message: "Email y/o contraseña incorrecta" });

  return res
    .status(200)
    .json({
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
};

const validateLoginUser = (req) => {
  const result = {
    error: false,
    message: "",
  };
  const { email, password } = req;

  if (!email || !validateEmail(email))
    return {
      error: true,
      message: "Mail inválido",
    };
  else if (!password || !validatePassword(password, 7, null, true, true)) {
    return {
      error: true,
      message: "Contraseña inválida",
    };
  }

  return result;
};

const validateRegisterUser = (req) => {
  const result = {
    error: false,
    message: "",
  };

  const { name, email, password } = req;

  if (!name || !validateString(name, null, 100))
    return {
      error: true,
      message: "El nombre y apellido son necesarios",
    };

  if (!email || !validateEmail(email))
    return {
      error: true,
      message: "Mail inválido",
    };
  else if (!password || !validatePassword(password, 7, null, true, true)) {
    return {
      error: true,
      message:
        "La contraseña debe tener al menos 7 caracteres, una mayúscula y un número",
    };
  }

  return result;
};
