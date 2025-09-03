const Validations = ({ datos }) => {
  const errores = {};

  if (!datos.nombreCliente.trim()) {
    errores.nombreCliente = "El nombre del cliente es obligatorio";
  } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(datos.nombreCliente)) {
    errores.nombreCliente = "Solo se permiten letras";
  }

  if (!datos.fecha.trim()) {
    errores.fecha = "La fecha es obligatoria";
  }

  if (!datos.hora.trim()) {
    errores.hora = "La hora es obligatoria";
  }

  if (!datos.servicio.trim()) {
    errores.servicio = "El servicio es obligatorio";
  }

  return errores;
};

function isPastDate(dateStr) {
  const hoy = new Date();
  const fecha = new Date(dateStr);
  hoy.setHours(0, 0, 0, 0);
  fecha.setHours(0, 0, 0, 0);
  return fecha < hoy;
}

function isClosedDay(dateStr) {
  const fecha = new Date(dateStr);
  const dia = fecha.getDay(); 
  return dia === 0;
}

function isValidHour(timeStr) {
  const [hora, minutos] = timeStr.split(":").map(Number);
  return hora >= 10 && (hora < 19 || (hora === 19 && minutos === 0));
}

export default Validations;
