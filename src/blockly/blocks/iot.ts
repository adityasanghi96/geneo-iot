import * as Blockly from 'blockly';

export function defineIotBlocks() {
  Blockly.defineBlocksWithJsonArray([
    {
      type: 'iot_wifi_connect',
      message0: 'connect WiFi SSID %1 password %2',
      args0: [
        { type: 'field_input', name: 'SSID', text: 'MyWiFi' },
        { type: 'field_input', name: 'PASSWORD', text: 'password' },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: '#0e7490',
      tooltip: 'Connect to a WiFi network',
      helpUrl: '',
    },
    {
      type: 'iot_mqtt_connect',
      message0: 'MQTT connect broker %1 client %2',
      args0: [
        { type: 'field_input', name: 'BROKER', text: 'broker.hivemq.com' },
        { type: 'field_input', name: 'CLIENT_ID', text: 'esp32-client' },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: '#0e7490',
      tooltip: 'Connect to an MQTT broker',
      helpUrl: '',
    },
    {
      type: 'iot_mqtt_publish',
      message0: 'MQTT publish topic %1 message %2',
      args0: [
        { type: 'field_input', name: 'TOPIC', text: 'geneo/sensor' },
        {
          type: 'input_value',
          name: 'MESSAGE',
          check: ['String', 'Number'],
        },
      ],
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      colour: '#0e7490',
      tooltip: 'Publish a message to an MQTT topic',
      helpUrl: '',
    },
    {
      type: 'iot_http_get',
      message0: 'HTTP GET url %1',
      args0: [{ type: 'field_input', name: 'URL', text: 'http://example.com/api' }],
      output: 'String',
      colour: '#0e7490',
      tooltip: 'Perform an HTTP GET request and return the response',
      helpUrl: '',
    },
  ]);
}
