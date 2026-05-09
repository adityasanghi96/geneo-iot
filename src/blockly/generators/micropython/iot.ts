import { PythonGenerator, Order } from 'blockly/python';

export function registerIotGenerators(gen: PythonGenerator) {
  gen.forBlock['iot_wifi_connect'] = function (block) {
    const ssid = block.getFieldValue('SSID');
    const password = block.getFieldValue('PASSWORD');
    return (
      `_sta = network.WLAN(network.STA_IF)\n` +
      `_sta.active(True)\n` +
      `_sta.connect('${ssid}', '${password}')\n` +
      `while not _sta.isconnected():\n    pass\n` +
      `print('WiFi connected:', _sta.ifconfig())\n`
    );
  };

  gen.forBlock['iot_mqtt_connect'] = function (block) {
    const broker = block.getFieldValue('BROKER');
    const clientId = block.getFieldValue('CLIENT_ID');
    return (
      `_mqtt = MQTTClient('${clientId}', '${broker}')\n` +
      `_mqtt.connect()\n` +
      `print('MQTT connected to ${broker}')\n`
    );
  };

  gen.forBlock['iot_mqtt_publish'] = function (block, generator) {
    const topic = block.getFieldValue('TOPIC');
    const message = generator.valueToCode(block, 'MESSAGE', Order.ATOMIC) || "''";
    return `_mqtt.publish('${topic}', str(${message}))\n`;
  };

  gen.forBlock['iot_http_get'] = function (block) {
    const url = block.getFieldValue('URL');
    return [`urequests.get('${url}').text`, Order.FUNCTION_CALL];
  };
}
