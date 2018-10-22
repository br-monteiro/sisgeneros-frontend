import Authenticatior from './Authenticator';

const dialog = (component, rawResponse, schemaMessage) => {
  const response = rawResponse.response;
  if (response) {
    const data = response.data;
    const httpCode = response.status;
    const message = data.message;
    // const status = data.status;
    // const details = data.details;
    const error = data.error;
    if (httpCode === 401 && message === 'User with expired authentication') {
      Authenticatior.removeUser();
      component.$router.push('/login');
    }

    if (httpCode === 400 && typeof component.dialog === 'function' && message === 'There are wrong fields in submission') {
      if (schemaMessage.maps && error) {
        let msg = error.length > 1 ? 'Os seguintes campos são obrigatórios: ' : 'O seguinte campo é obrigatório: ';
        msg += error.map((el) => {
          const i = schemaMessage.maps[el.property];
          if (el.constraint === 'required') {
            return i;
          }
          if (el.constraint === 'minLength') {
            return `${i} no mínimo ${el.minLength} caracteres`;
          }
          if (el.constraint === 'maxLength') {
            return `${i} no máximo ${el.minLength} caracteres`;
          }
          if (el.constraint === 'minimum') {
            return `${i} deve ser no mínimo ${el.minimum}`;
          }
          return '';
        }).join(', ');
        component.dialog(msg);
      }
    }
  }
};

export default { dialog };
