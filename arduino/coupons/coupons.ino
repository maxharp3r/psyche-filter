/* 

 Web_HelloWorld.pde - very simple Webduino example 

 curl -X POST --data "text=here is a nifty coupon" http://192.168.71.3/c
 
 Docs:
 * https://github.com/sirleech/Webduino/
 * https://www.adafruit.com/products/597#Downloads
     * http://learn.adafruit.com/mini-thermal-receipt-printer/
 * wiring
     * http://bildr.org/2011/08/thermal-printer-arduino/
 * form url encoding
     * https://en.wikipedia.org/wiki/POST_(HTTP)
 */

#include "SPI.h"
#include "Ethernet.h"

// external libs
#include "WebServer.h"
#include "SoftwareSerial.h"
#include "Adafruit_Thermal.h"


// web server setup
static uint8_t mac[] = { 0x90, 0xA2, 0xDA, 0x0D, 0xA7, 0x3D };
static uint8_t ip[] = { 192, 168, 71, 3 };
#define PREFIX ""
WebServer webserver(PREFIX, 80);
#define NAMELEN 32
#define VALUELEN 256


// printer setup
int printer_RX_Pin = 5;  // This is the green wire
int printer_TX_Pin = 6;  // This is the yellow wire
Adafruit_Thermal printer(printer_RX_Pin, printer_TX_Pin);


// web server messages (read only memory)
P(helloMsg) = "<h1>Hello, World!</h1>";
P(couponMsg) = "<h1>Give me a coupon.</h1>\n";


void helloCmd(WebServer &server, WebServer::ConnectionType type, char *, bool) {
  server.httpSuccess();
  if (type == WebServer::HEAD) {
    return;
  }
  server.printP(helloMsg);
}

void couponCmd(WebServer &server, WebServer::ConnectionType type, char *, bool) {
  if (type != WebServer::POST) {
    server.httpFail();
    server.printP("Use a post");
    return;
  }
  
  char name[NAMELEN];
  char value[VALUELEN];
  server.httpSuccess();
  server.printP(couponMsg);
  
  printer.wake();
  printer.setDefault();
  while (server.readPOSTparam(name, NAMELEN, value, VALUELEN)) {
    // Serial.print("found post param: ");
    // Serial.println(name);
    if (strncmp(name, "large", 5) == 0) {
      printer.setSize('L');
      printer.print(value);
      printer.setSize('S');
      printer.feed(2);
    } else if (strncmp(name, "inverse", 7) == 0) {
      printer.inverseOn();
      printer.print(value);
      printer.inverseOff();
      printer.feed(2);
    } else if (strncmp(name, "word", 4) == 0) {
      printer.print(value);
      printer.print(", ");
    } else {
      printer.println(value);
      printer.feed(2);
    }
  }
  printer.feed(4);
  printer.sleep();
}

void setup() {
  Ethernet.begin(mac, ip);
  webserver.setDefaultCommand(&helloCmd);
  webserver.addCommand("index.html", &helloCmd);
  webserver.addCommand("c", &couponCmd);
  webserver.begin();
  
  Serial.begin(9600);
  Serial.println("starting web server");
  
  pinMode(7, OUTPUT); digitalWrite(7, LOW); // To also work w/IoTP printer
  printer.begin();
}

void loop() {
  char buff[64];
  int len = 64;
  webserver.processConnection(buff, &len);
}

