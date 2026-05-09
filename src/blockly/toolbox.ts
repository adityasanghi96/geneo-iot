import * as Blockly from 'blockly';

export const toolboxConfig: Blockly.utils.toolbox.ToolboxDefinition = {
  kind: 'categoryToolbox',
  contents: [
    // ── NetLogic ──────────────────────────────────────────────
    {
      kind: 'category',
      name: 'NetLogic',
      colour: '#7c3aed',
      contents: [
        { kind: 'block', type: 'netlogic_read_sensor' },
        { kind: 'block', type: 'netlogic_send_data' },
        { kind: 'block', type: 'netlogic_if_cloud' },
      ],
    },
    // ── Motors ───────────────────────────────────────────────
    {
      kind: 'category',
      name: 'Motors',
      colour: '#0f766e',
      contents: [
        { kind: 'block', type: 'motor_dc_set_speed' },
        { kind: 'block', type: 'motor_dc_stop' },
        { kind: 'block', type: 'motor_servo_set_angle' },
      ],
    },
    // ── IOT ──────────────────────────────────────────────────
    {
      kind: 'category',
      name: 'IOT',
      colour: '#0e7490',
      contents: [
        { kind: 'block', type: 'iot_wifi_connect' },
        { kind: 'block', type: 'iot_mqtt_connect' },
        { kind: 'block', type: 'iot_mqtt_publish' },
        { kind: 'block', type: 'iot_http_get' },
      ],
    },
    // ── Display ───────────────────────────────────────────────
    {
      kind: 'category',
      name: 'Display',
      colour: '#0369a1',
      contents: [
        { kind: 'block', type: 'display_oled_init' },
        { kind: 'block', type: 'display_oled_text' },
        { kind: 'block', type: 'display_oled_clear' },
        { kind: 'block', type: 'display_serial_print' },
      ],
    },
    // ── Logic (Blockly built-in) ──────────────────────────────
    {
      kind: 'category',
      name: 'Logic',
      colour: '#0d9488',
      contents: [
        { kind: 'block', type: 'controls_if' },
        { kind: 'block', type: 'logic_compare' },
        { kind: 'block', type: 'logic_operation' },
        { kind: 'block', type: 'logic_negate' },
        { kind: 'block', type: 'logic_boolean' },
      ],
    },
    // ── Loops (Blockly built-in) ──────────────────────────────
    {
      kind: 'category',
      name: 'Loops',
      colour: '#16a34a',
      contents: [
        { kind: 'block', type: 'timing_forever' },
        { kind: 'block', type: 'timing_repeat_n' },
        { kind: 'block', type: 'controls_whileUntil' },
        { kind: 'block', type: 'controls_for' },
        { kind: 'block', type: 'controls_forEach' },
        { kind: 'block', type: 'controls_flow_statements' },
      ],
    },
    // ── Math (Blockly built-in) ───────────────────────────────
    {
      kind: 'category',
      name: 'Math',
      colour: '#0891b2',
      contents: [
        { kind: 'block', type: 'math_number' },
        { kind: 'block', type: 'math_arithmetic' },
        { kind: 'block', type: 'math_single' },
        { kind: 'block', type: 'math_trig' },
        { kind: 'block', type: 'math_constant' },
        { kind: 'block', type: 'math_number_property' },
        { kind: 'block', type: 'math_round' },
        { kind: 'block', type: 'math_on_list' },
        { kind: 'block', type: 'math_modulo' },
        { kind: 'block', type: 'math_constrain' },
        { kind: 'block', type: 'math_random_int' },
        { kind: 'block', type: 'math_random_float' },
      ],
    },
    // ── Text (Blockly built-in) ───────────────────────────────
    {
      kind: 'category',
      name: 'Text',
      colour: '#dc2626',
      contents: [
        { kind: 'block', type: 'text' },
        { kind: 'block', type: 'text_join' },
        { kind: 'block', type: 'text_append' },
        { kind: 'block', type: 'text_length' },
        { kind: 'block', type: 'text_isEmpty' },
        { kind: 'block', type: 'text_indexOf' },
        { kind: 'block', type: 'text_charAt' },
        { kind: 'block', type: 'text_getSubstring' },
        { kind: 'block', type: 'text_changeCase' },
        { kind: 'block', type: 'text_trim' },
      ],
    },
    // ── Lists (Blockly built-in) ──────────────────────────────
    {
      kind: 'category',
      name: 'Lists',
      colour: '#991b1b',
      contents: [
        { kind: 'block', type: 'lists_create_empty' },
        { kind: 'block', type: 'lists_create_with' },
        { kind: 'block', type: 'lists_repeat' },
        { kind: 'block', type: 'lists_length' },
        { kind: 'block', type: 'lists_isEmpty' },
        { kind: 'block', type: 'lists_indexOf' },
        { kind: 'block', type: 'lists_getIndex' },
        { kind: 'block', type: 'lists_setIndex' },
        { kind: 'block', type: 'lists_getSublist' },
      ],
    },
    // ── Variables (dynamic) ───────────────────────────────────
    {
      kind: 'category',
      name: 'Variables',
      colour: '#7c3aed',
      custom: 'VARIABLE',
    },
    // ── Functions (dynamic) ───────────────────────────────────
    {
      kind: 'category',
      name: 'Functions',
      colour: '#4338ca',
      custom: 'PROCEDURE',
    },
    // ── Timing ───────────────────────────────────────────────
    {
      kind: 'category',
      name: 'Timing',
      colour: '#0f766e',
      contents: [
        { kind: 'block', type: 'timing_wait' },
        { kind: 'block', type: 'timing_forever' },
        { kind: 'block', type: 'timing_repeat_n' },
      ],
    },
    // ── Machine ──────────────────────────────────────────────
    {
      kind: 'category',
      name: 'Machine',
      colour: '#374151',
      contents: [
        {
          kind: 'category',
          name: 'In/Out Pins',
          colour: '#374151',
          contents: [
            { kind: 'block', type: 'gpio_set_pin_mode' },
            { kind: 'block', type: 'gpio_digital_write' },
            { kind: 'block', type: 'gpio_digital_read' },
            { kind: 'block', type: 'gpio_analog_read' },
          ],
        },
      ],
    },
    // ── Files ────────────────────────────────────────────────
    {
      kind: 'category',
      name: 'Files',
      colour: '#1f2937',
      contents: [
        { kind: 'block', type: 'project_info' },
        { kind: 'block', type: 'sketch' },
      ],
    },
    // ── Network and Internet ──────────────────────────────────
    {
      kind: 'category',
      name: 'Network and Internet',
      colour: '#111827',
      contents: [
        { kind: 'block', type: 'iot_wifi_connect' },
        { kind: 'block', type: 'iot_mqtt_connect' },
        { kind: 'block', type: 'iot_mqtt_publish' },
        { kind: 'block', type: 'iot_http_get' },
      ],
    },
  ],
};
