const WorkWithUs = () => {
  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <h1 className="text-center mb-4">Trabajá con Nosotros</h1>
          <p className="text-center text-muted mb-4">
            ¿Te apasiona la peluquería y el trato con las personas?
            <br /> Completá el formulario y envianos tu CV.
          </p>

          <form>
            <div className="mb-3">
              <label className="form-label">Nombre completo</label>
              <input type="text" className="form-control" placeholder="Tu nombre" />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" placeholder="tucorreo@mail.com" />
            </div>

            <div className="mb-3">
              <label className="form-label">Puesto al que aplicás</label>
              <select className="form-select">
                <option value="">Selecciona un puesto</option>
                <option value="peluquero">Peluquero/a</option>
                <option value="colorista">Colorista</option>
                <option value="recepcion">Recepcionista</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Mensaje</label>
              <textarea className="form-control" rows="4" placeholder="Algo que quieras contarnos..."></textarea>
            </div>

            <div className="mb-3">
              <label className="form-label">Adjuntar CV</label>
              <input type="file" className="form-control" />
            </div>

            <div className="text-center">
              <button type="submit" className="btn btn-dark">
                Enviar solicitud
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default WorkWithUs

