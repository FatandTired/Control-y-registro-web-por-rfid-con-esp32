//Librerias a utilizar
#include <LiquidCrystal_I2C.h>
#include <ArduinoJson.h>
#include <ESP32Servo.h>
#include <HTTPClient.h>
#include <MFRC522.h>
#include <WiFi.h>
#include <SPI.h>

//Pines a utilizar

//RFID
#define SS_PIN 5
#define RST_PIN 3
//Leds
#define GREEN_LED 17
#define RED_LED 16
//Servomotor
#define SERVO_PIN 15
//Sensor de obstaculos
#define SENSOR_PIN 4

//Datos de la conexion Wifi
#define ssid ""
#define password ""

//Url de la api
#define apiUrl ""

//Creacion de clases
LiquidCrystal_I2C lcd(0x27, 16, 2);
MFRC522 mfrc522(SS_PIN, RST_PIN);
HTTPClient http;
Servo servo;

//Variables de verificación
bool cardRead = false;
bool isAllowed = false;
bool irState = false;

void setup() {
  Serial.begin(9600);
  //Modo de los pines
  pinMode(GREEN_LED, OUTPUT);
  pinMode(RED_LED, OUTPUT);
  pinMode(SENSOR_PIN, INPUT);
  servo.attach(SERVO_PIN, 1000, 2000);
  //Inicio del lcd
  lcd.init();
  lcd.backlight();
  //Inicio del rfid
  SPI.begin();
  mfrc522.PCD_Init();
  //Conexión Wifi
  Serial.println("Conectando a la red...");
  WiFi.begin(ssid, password);
  delay(1000);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("WiFi Conectado");
  Serial.print("Direccion IP asignada: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  //Verificar si existe la conexion wifi
  if (WiFi.status() == WL_CONNECTED) { 
    //Verificar si esta permitido el acceso
    if (isAllowed) {
      //Verificar si el sensor de obstaculos detecta el paso de una persona
      if (digitalRead(SENSOR_PIN) == LOW) {
        if (!irState) {
          Serial.println("Persona pasando");
          irState = true;
        }
      } else {
        if (irState) {
          //Una vez la persona pasa, se reinicia el acceso
          resetAccess();
        }
      }
    } else {
      //Verificar si hay un tag UID presente en el sensor
      if (mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial()) {
        mfrc522.PICC_IsNewCardPresent();
        //Verificar si ya leyo el tag para evitar ejecutar el sistema mas de una vez
        if (!cardRead) {
          cardRead = true;
          lcd.clear();
          //Leer el UID del tag
          String tagUID = readRFID(); 
          //Verificar si es valido o no
          if (isValid(tagUID)) {
            //Permitir el acceso
            allowAccess(tagUID);
          } else {
            //Denegar el acceso
            denyAccess(tagUID);
          }
        }
      } else {
        cardRead = false;
      }
    }
  }
}
String readRFID() {
  String tag = "";
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    tag.concat(String(mfrc522.uid.uidByte[i], HEX));
  }
  tag.toUpperCase();
  return tag;
}
bool isValid(String tag) {
  Serial.println("Enviando datos a la api...");
  //Crear un objeto json para enviar los datos a la api
  char postBody[128];
  JsonDocument doc;
  JsonObject object = doc.to<JsonObject>();
  //Agregar la propiedad uuid
  object["uuid"] = tag;
  serializeJson(doc, postBody);
  //Iniciar la conexion http
  http.begin(apiUrl);
  http.addHeader("Content-Type", "application/json");
  //Enviar los datos y guardar la respuesta en una variable
  int httpCode = http.POST(String(postBody));
  Serial.print("Código http: ");
  Serial.println(httpCode);
  http.end();
  //Cerrar la conexion y validar el codigo, si es 200 es un UID valido de lo contrario no es valido
  if (httpCode == 200) {
    return true;
  } else return false;
}
void allowAccess(String tag) {
  isAllowed = true;
  //Imprimir en la lcd
  lcd.print("Acceso Permitido");
  Serial.print("Acceso permitido para UID: ");
  Serial.println(tag);
  //Mover el servomotor para permitir el acceso
  servo.write(180);
  delay(15);
  //Encender durante 1.5s el led verde
  digitalWrite(GREEN_LED, HIGH);
  delay(1500);
  digitalWrite(GREEN_LED, LOW);
}
void denyAccess(String tag) {
  //Imprimir en la lcd
  lcd.print("Acceso Denegado");
  Serial.print("Acceso denegado para UID: ");
  Serial.println(tag);
  //Encender el led rojo durante 2s
  digitalWrite(RED_LED, HIGH);
  delay(2000);
  digitalWrite(RED_LED, LOW);
  lcd.clear();
}
void resetAccess() {
  //Esperar 2 segundos para poder cerrar el acceso y reiniciar las variables para el siguiente bucle
  delay(2000);
  isAllowed = false;
  irState = false;
  servo.write(0);
  delay(15);
  lcd.clear();
  Serial.println("Persona entró");
}