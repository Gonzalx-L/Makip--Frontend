import loginImg from "../assets/img-login.png";

const LoginAdm = () => (
  <div className='container min-vh-100 d-flex align-items-center justify-content-center'>
    <div className='row w-100 justify-content-center align-items-center'>
      <div className='col-lg-5 d-flex justify-content-center mb-4 mb-lg-0'>
        <img
          src={loginImg}
          alt='Login'
          className='img-fluid'
          style={{ maxWidth: 380, width: "100%" }}
        />
      </div>

      <div className='col-lg-5 d-flex justify-content-center'>
        <form
          className='bg-white p-4 rounded shadow'
          style={{ minWidth: 300, maxWidth: 370, width: "100%" }}>
          <h1 className='mb-4 text-center'>Panel de Acceso</h1>
          <div className='mb-3'>
            <label htmlFor='usuario' className='form-label'>
              Usuario
            </label>
            <input
              id='usuario'
              name='usuario'
              type='text'
              placeholder='Tu usuario'
              className='form-control'
              autoComplete='username'
            />
          </div>
          <div className='mb-3'>
            <label htmlFor='clave' className='form-label'>
              Contraseña
            </label>
            <input
              id='clave'
              name='clave'
              type='password'
              placeholder='Tu contraseña'
              className='form-control'
              autoComplete='current-password'
            />
          </div>
          <button type='submit' className='btn btn-primary w-100'>
            Ingresar
          </button>
          <div className='text-center mt-3'>
            <a href='#' className='text-decoration-none'>
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </form>
      </div>
    </div>
  </div>
);

export default LoginAdm;
