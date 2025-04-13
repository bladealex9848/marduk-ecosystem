# Pruebas de OpenRouter API

Este directorio contiene varias pruebas para verificar la conexión y funcionalidad de la API de OpenRouter.

## Pruebas de Terminal

Estas pruebas se ejecutan desde el terminal y son útiles para verificar la conexión con la API de OpenRouter sin necesidad de un navegador.

- **test-api-terminal.js**: Lee la API key directamente del archivo `.env` en la raíz del proyecto y prueba la conexión con la API de OpenRouter.
- **test-terminal-final.js**: Versión simplificada que prueba la autenticación y las solicitudes de chat.
- **test-terminal-secure.js**: Versión más segura que oculta la API key en los registros.
- **test-api-key.js**: Prueba básica de la API key.
- **test-demo-key.js**: Prueba con una API key de demostración.
- **test-env.js**: Prueba la carga de variables de entorno desde el archivo `.env`.
- **test-openrouter-direct-fetch.js**: Prueba directa con fetch.
- **test-openrouter-node-fetch.js**: Prueba con node-fetch.
- **test-openrouter-secure.js**: Prueba segura que no expone la API key.

## Pruebas de Navegador

Estas pruebas se ejecutan en el navegador y son útiles para verificar la integración con la interfaz de usuario.

- **test-env-access.html**: Prueba si el archivo `.env` es accesible desde el navegador.
- **test-env-direct.html**: Prueba la carga directa del archivo `.env` desde JavaScript.
- **test-models-improved.html**: Muestra los modelos disponibles en OpenRouter, tanto locales como desde la API.
- **test-openrouter-improved.html**: Prueba mejorada de la API de OpenRouter con interfaz de usuario.
- **test-models.html**: Versión original de la lista de modelos.
- **test-openrouter-secure.html**: Versión original de la prueba segura.

## Cómo ejecutar las pruebas

### Pruebas de Terminal

Para ejecutar las pruebas de terminal, usa el comando `node` seguido del nombre del archivo:

```bash
node tests/test-api-terminal.js
```

### Pruebas de Navegador

Para ejecutar las pruebas de navegador, abre el archivo HTML en tu navegador:

```bash
open tests/test-env-access.html
```

O navega a la URL correspondiente en tu servidor local:

```
http://localhost:3000/tests/test-env-access.html
```

## Notas importantes

- Asegúrate de tener un archivo `.env` válido en la raíz del proyecto con la variable `OPENROUTER_API_KEY`.
- Las pruebas de navegador pueden requerir un servidor web local para funcionar correctamente.
- Algunas pruebas pueden exponer la API key en los registros, así que ten cuidado al compartir los resultados.
