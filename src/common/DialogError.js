import Authenticatior from './Authenticator';

const dialog = (component, rawResponse, schemaMessage) => {
  const response = rawResponse.response;
  if (response) {
    const data = response.data;
    const httpCode = response.status;
    const message = data.message;
    const status = data.status;
    // const details = data.details;
    const error = data.error;
    let msg;

    // usuário com token expirado
    if (httpCode === 401 && message === 'User with expired authentication') {
      Authenticatior.removeUser();
      component.$router.push('/login');
    }

    // mensagens para campos inválidos
    if (httpCode === 400 && typeof component.dialog === 'function' && message === 'There are wrong fields in submission') {
      if (schemaMessage.maps && error) {
        msg = error.length > 1 ? 'Os seguintes campos são obrigatórios: ' : 'O seguinte campo é obrigatório: ';
        msg += error.map((el) => {
          const propertyName = el.property.replace(/([[\]\d.]+)/g, '_');
          const i = schemaMessage.maps[propertyName];
          if (el.constraint === 'required') {
            return i;
          }
          if (el.constraint === 'minLength') {
            return `${i} no mínimo ${el.minLength} caracteres`;
          }
          if (el.constraint === 'minItems') {
            const correctWord = el.minLength > 1 ? 'items' : 'item';
            return `${i} no mínimo ${el.minItems} ${correctWord}`;
          }
          if (el.constraint === 'maxLength') {
            return `${i} no máximo ${el.maxLength} caracteres`;
          }
          if (el.constraint === 'minimum') {
            return `${i} deve ser no mínimo ${el.minimum}`;
          }
          if (el.constraint === 'maximum') {
            return `${i} deve ser no máximo ${el.maximum}`;
          }
          return '';
        }).join(', ');
        component.dialog(msg);
      }
    }

    // mensagens para duplicidade de registro
    if (httpCode === 400 && typeof component.dialog === 'function' && status === 'warning') {
      const matches = /entry\s'(.*?)'.*?'(\w+)_/.exec(message);
      if (matches.length >= 3) {
        const i = schemaMessage.maps[matches[2]];
        component.dialog(`Já existe registro com ${i}: ${matches[1]}`);
      }
    }
  }
};

export default { dialog };
