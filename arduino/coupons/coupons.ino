/* 

Web_HelloWorld.pde - very simple Webduino example 

curl -X POST --data "text=here is a nifty coupon" http://192.168.0.38/c

Docs:
* https://github.com/sirleech/Webduino/
* https://www.adafruit.com/products/597#Downloads
 
 */

#include "SPI.h"
#include "Ethernet.h"
#include "WebServer.h"

static uint8_t mac[] = { 0x90, 0xA2, 0xDA, 0x0D, 0xA7, 0x3D };
static uint8_t ip[] = { 192, 168, 0, 38 };
int led = 13;


/* This creates an instance of the webserver.  By specifying a prefix
 * of "", all pages will be at the root of the server. */
#define PREFIX ""
WebServer webserver(PREFIX, 80);

// messages (read only memory)
P(helloMsg) = "<h1>Hello, World!</h1>";
P(couponMsg) = "<h1>Give me a coupon.</h1>\n";

#define NAMELEN 32
#define VALUELEN 256


void helloCmd(WebServer &server, WebServer::ConnectionType type, char *, bool) {
  server.httpSuccess();

  if (type == WebServer::HEAD) {
    return;
  }
  
  server.printP(helloMsg);
  
//  Serial.println("high");
//  digitalWrite(led, HIGH);   // turn the LED on (HIGH is the voltage level)
//  delay(1000);               // wait for a second
//  Serial.println("low");
//  digitalWrite(led, LOW);    // turn the LED off by making the voltage LOW
}

void couponCmd(WebServer &server, WebServer::ConnectionType type, char *, bool) {
  if (type != WebServer::POST) {
    server.httpFail();
    server.printP("Use a post");
    return;
  }
  
  server.httpSuccess();
  
  char name[NAMELEN];
  char value[VALUELEN];
  
  server.printP(couponMsg);
  
  while (server.readPOSTparam(name, NAMELEN, value, VALUELEN)) {
    server.print("\n");
    server.print(name);
    server.print(" =>");
    server.print(value);
    server.print("\n");
  }
  
}

void setup() {
  Ethernet.begin(mac, ip);
  webserver.setDefaultCommand(&helloCmd);
  webserver.addCommand("index.html", &helloCmd);
  webserver.addCommand("c", &couponCmd);
  webserver.begin();
  
//  pinMode(led, OUTPUT);
  Serial.begin(9600);
  Serial.println("starting web server");
}

void loop() {
  char buff[64];
  int len = 64;
  webserver.processConnection(buff, &len);
}

