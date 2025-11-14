import { useState } from "react";
import api from "../components/services/API/Axios";
import {
  successToast,
  errorToast,
} from "../components/ui/toast/NotificationToast";
import { Form, Button, Row, Col } from "react-bootstrap";

const WorkWithUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
    cvFile: null,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "cvFile") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validate = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.name) {
      newErrors.name = "El nombre es obligatorio.";
      isValid = false;
    } else if (formData.name.length > 50) {
      newErrors.name = "Máximo 50 caracteres.";
      isValid = false;
    }

    if (!formData.surname) {
      newErrors.surname = "El apellido es obligatorio.";
      isValid = false;
    } else if (formData.surname.length > 50) {
      newErrors.surname = "Máximo 50 caracteres.";
      isValid = false;
    }

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Ingrese un email válido.";
      isValid = false;
    } else if (formData.email.length > 60) {
      newErrors.email = "Máximo 60 caracteres.";
      isValid = false;
    }

    const phoneRegex = /^\d{10,20}$/;
    const cleanNumber = formData.phone.replace(/[\s-()+\.]/g, "");
    if (!cleanNumber || !phoneRegex.test(cleanNumber)) {
      newErrors.phone = "Teléfono inválido (mín. 10 y máx. 20 dígitos).";
      isValid = false;
    }

    if (!formData.cvFile) {
      newErrors.cvFile = "Debe adjuntar su CV.";
      isValid = false;
    } else if (formData.cvFile.type !== "application/pdf") {
      newErrors.cvFile = "Solo se permiten archivos PDF.";
      isValid = false;
    } else if (formData.cvFile.size > 5 * 1024 * 1024) {
      // 5MB limit
      newErrors.cvFile = "El archivo debe ser menor a 5MB.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    const data = new FormData();
    data.append("Name", formData.name);
    data.append("Surname", formData.surname);
    data.append("Email", formData.email);
    data.append("Phone", formData.phone.replace(/[\s-()+\.]/g, ""));
    data.append("CvFile", formData.cvFile);

    try {
      await api.post("/curriculum", data, {
        headers: {
          "Content-Type": undefined,
        },
      });

      successToast("¡Postulación enviada con éxito! Nos contactaremos pronto.");

      setFormData({
        name: "",
        surname: "",
        email: "",
        phone: "",
        cvFile: null,
      });
      setErrors({});
      e.target.reset();
    } catch (err) {
      const message =
        err.response?.data?.message || "Error al enviar la postulación.";
      errorToast(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <h1 className="text-center mb-4">Trabajá con Nosotros</h1>
          <p className="text-center text-muted mb-4">
            ¿Te apasiona la peluquería y el trato con las personas?
            <br /> Completá el formulario y envianos tu CV.
          </p>

          <Form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                name="name"
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                placeholder="Tu nombre"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && (
                <div className="invalid-feedback">{errors.name}</div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Apellido</label>
              <input
                type="text"
                name="surname"
                className={`form-control ${errors.surname ? "is-invalid" : ""}`}
                placeholder="Tu apellido"
                value={formData.surname}
                onChange={handleChange}
              />
              {errors.surname && (
                <div className="invalid-feedback">{errors.surname}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                placeholder="tucorreo@mail.com"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <div className="invalid-feedback">{errors.email}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Teléfono</label>
              <input
                type="tel"
                name="phone"
                className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                placeholder="Ej: 3411234567"
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && (
                <div className="invalid-feedback">{errors.phone}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">
                Adjuntar CV (Máx 5MB, solo PDF)
              </label>
              <input
                type="file"
                name="cvFile"
                className={`form-control ${errors.cvFile ? "is-invalid" : ""}`}
                accept=".pdf"
                onChange={handleChange}
              />
              {errors.cvFile && (
                <div className="invalid-feedback">{errors.cvFile}</div>
              )}
            </div>

            <div className="text-center">
              <Button type="submit" variant="dark" disabled={isSubmitting}>
                {isSubmitting ? "Enviando..." : "Enviar solicitud"}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default WorkWithUs;
