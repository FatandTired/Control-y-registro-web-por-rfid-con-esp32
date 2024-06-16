# Control y Registro de Ingreso Mediante Identificación por Radio Frecuencias

Sistema basado en el uso del microcontrolador ESP32 y el sensor RFID RC522 para validar tarjetas de identificación mediante un servidor express y mongodb como base de datos.

## Características
- Validación de UIDs mediante servidor express
- Apartado de registros en la página web
- Apartado de modificación de estudiantes en la página web
- Apartado de asignación en la página web

## Configuración del sistema

**Para el servidor express:** Renombrar el archivo [/server/.env.example](https://github.com/FatandTired/Control-y-registro-web-por-rfid-con-esp32/blob/master/server/.env.example)  a .env y definir la url de conexión a la base de datos mongodb

```json
MONGO_URL="Url de conexión a mongodb"
```
**Para la página en react:** Renombrar el archivo [/web/src/example-config.json](https://github.com/FatandTired/Control-y-registro-web-por-rfid-con-esp32/blob/master/web/src/example-config.json) a config.json y definir las url del servidor express y el socket

```json
{
    "apiUrl": "Url del servidor api",
    "socketUrl": "Url del socket"
}
```

**Para el circuito:** Realizar todas las conexiones mostradas en [/sistema/physical_circuit.jpg](https://github.com/FatandTired/Control-y-registro-web-por-rfid-con-esp32/blob/master/sistema/physical_circuit.jpg) y  cargar el archivo [rfidaccesscontrol.ino](https://github.com/FatandTired/Control-y-registro-web-por-rfid-con-esp32/blob/master/sistema/rfidaccesscontrol.ino) con las variables ssid, wifi y apiUrl definidas.

```json
#define ssid "Nombre de la red Wifi"
#define password "Contraseña de la red Wifi"
#define apiUrl "Url del servidor express"
```
## Tecnologías
-   [Node.js](https://nodejs.org/): Usado para la web y el servidor.
-   [Express.js](https://expressjs.com/): Usado para el servidor.
-   [React](https://react.dev): Usado para la página web.
-   [TypeScript](https://www.typescriptlang.org/): Lenguaje usado para la web y el servidor.
-   [MongoDB](https://www.mongodb.com/): Usado como base de datos.
-   [Arduino IDE](https://www.arduino.cc/en/software/): Usado para programar la ESP32.
## Licencia

[MIT](https://choosealicense.com/licenses/mit/)