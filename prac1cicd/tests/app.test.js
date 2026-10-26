const { test } = require('node:test');
const assert = require('node:assert/strict');
const { JSDOM } = require('jsdom');
const fs = require('node:fs');
const path = require('node:path');

const html = `
<!DOCTYPE html>
<html>
<body>
  <form id="loginForm">
    <input id="email">
    <input id="password">
    <span id="emailError"></span>
    <span id="pwdError"></span>
    <p id="formMsg"></p>
  </form>
</body>
</html>
`;

function crearFormulario() {
  const dom = new JSDOM(html, {
    runScripts: 'outside-only'
  });

  const jsPath = path.join(__dirname, '../js/app.js');
  const codigo = fs.readFileSync(jsPath, 'utf8');

  dom.window.eval(codigo);

  return dom;
}

test('rechaza un correo con formato incorrecto', () => {
  const dom = crearFormulario();
  const { document, Event } = dom.window;

  document.getElementById('email').value = 'correo-invalido';
  document.getElementById('password').value = 'Alumno123!';

  document.getElementById('loginForm').dispatchEvent(
    new Event('submit', { bubbles: true, cancelable: true })
  );

  assert.equal(
    document.getElementById('emailError').textContent,
    'Introduce un correo válido.'
  );

  dom.window.close();
});

test('rechaza una contraseña de menos de 8 caracteres', () => {
  const dom = crearFormulario();
  const { document, Event } = dom.window;

  document.getElementById('email').value = 'alumno@instituto.es';
  document.getElementById('password').value = '123';

  document.getElementById('loginForm').dispatchEvent(
    new Event('submit', { bubbles: true, cancelable: true })
  );

  assert.equal(
    document.getElementById('pwdError').textContent,
    'La contraseña debe tener mínimo 8 caracteres.'
  );

  dom.window.close();
});

test('permite iniciar sesión con las credenciales correctas', () => {
  const dom = crearFormulario();
  const { document, Event } = dom.window;

  document.getElementById('email').value = 'alumno@instituto.es';
  document.getElementById('password').value = 'Alumno123!';

  document.getElementById('loginForm').dispatchEvent(
    new Event('submit', { bubbles: true, cancelable: true })
  );

  assert.match(
    document.getElementById('formMsg').textContent,
    /Acceso correcto/
  );

  dom.window.close();
});

test('rechaza unas credenciales incorrectas', () => {
  const dom = crearFormulario();
  const { document, Event } = dom.window;

  document.getElementById('email').value = 'alumno@instituto.es';
  document.getElementById('password').value = 'OtraClave123!';

  document.getElementById('loginForm').dispatchEvent(
    new Event('submit', { bubbles: true, cancelable: true })
  );

  assert.match(
    document.getElementById('formMsg').textContent,
    /Credenciales incorrectas/
  );

  dom.window.close();
});
