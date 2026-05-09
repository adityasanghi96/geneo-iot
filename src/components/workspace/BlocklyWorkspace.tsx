import { useEffect, useRef } from 'react';
import * as Blockly from 'blockly';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setXml, setGeneratedCode } from '../../store/slices/workspaceSlice';
import { toolboxConfig } from '../../blockly/toolbox';
import { registerAllBlocks } from '../../blockly/blocks/index';
import { registerAllGenerators, generateMicroPython } from '../../blockly/generators/micropython/index';
import { useBlocklyExecution } from '../../hooks/useBlocklyExecution';

registerAllBlocks();
registerAllGenerators();

const WORKSPACE_OPTIONS: Blockly.BlocklyOptions = {
  toolbox: toolboxConfig,
  grid: {
    spacing: 20,
    length: 3,
    colour: '#e5e7eb',
    snap: false,
  },
  zoom: {
    controls: true,
    wheel: true,
    startScale: 1.0,
    maxScale: 3,
    minScale: 0.3,
    scaleSpeed: 1.2,
  },
  trashcan: true,
  scrollbars: true,
  sounds: false,
  renderer: 'geras',
  theme: Blockly.Theme.defineTheme('geneo', {
    name: 'geneo',
    base: Blockly.Themes.Classic,
    componentStyles: {
      workspaceBackgroundColour: '#f9fafb',
      toolboxBackgroundColour: '#1f2937',
      toolboxForegroundColour: '#ffffff',
      flyoutBackgroundColour: '#ddd',
      flyoutForegroundColour: '#ccc',
      flyoutOpacity: 0.9,
      scrollbarColour: '#797979',
      insertionMarkerColour: '#fff',
      insertionMarkerOpacity: 0.3,
      scrollbarOpacity: 0.4,
      cursorColour: '#d0d0ff',
    },
  }),
};

export default function BlocklyWorkspace() {
  const divRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
  const dispatch = useAppDispatch();
  const savedXml = useAppSelector((s) => s.workspace.xml);

  useEffect(() => {
    if (!divRef.current || workspaceRef.current) return;

    const ws = Blockly.inject(divRef.current, WORKSPACE_OPTIONS);
    workspaceRef.current = ws;

    // Paint each top-level toolbox category row with its declared colour.
    // Sub-category rows inherit the parent colour via CSS brightness filter.
    const cats = (toolboxConfig as { contents: Array<{ colour?: string }> }).contents;
    const paintToolboxRows = () => {
      // Blockly v12 geras → .blocklyToolboxDiv; zelos → .blocklyToolbox
      const toolboxEl = divRef.current?.querySelector<HTMLElement>(
        '.blocklyToolboxDiv, .blocklyToolbox'
      );
      if (!toolboxEl) return;
      const allRows = toolboxEl.querySelectorAll<HTMLElement>('.blocklyTreeRow');
      let catIdx = 0;
      allRows.forEach((row) => {
        // Skip sub-category rows (their parent is already a treeitem)
        const parentTreeItem = row.parentElement?.closest('[role="treeitem"]');
        if (parentTreeItem && parentTreeItem !== row.parentElement) return;
        const colour = cats[catIdx]?.colour ?? '#374151';
        row.style.backgroundColor = colour;
        catIdx++;
      });
    };
    setTimeout(paintToolboxRows, 60);
    ws.addChangeListener((e) => {
      if (e.type === Blockly.Events.TOOLBOX_ITEM_SELECT) {
        setTimeout(paintToolboxRows, 20);
        // Toggle flyout-open class so CSS can show/hide the workspace scrollbar
        const flyoutOpen = ws.getToolbox()?.getSelectedItem() != null;
        divRef.current?.classList.toggle('flyout-open', !!flyoutOpen);
      }
    });

    // Load saved XML — bump LAYOUT_VERSION to bust stale cached block positions
    const LAYOUT_VERSION = '4';
    if (localStorage.getItem('geneo-iot-layout-version') !== LAYOUT_VERSION) {
      localStorage.removeItem('geneo-iot-workspace');
      localStorage.setItem('geneo-iot-layout-version', LAYOUT_VERSION);
    }

    try {
      const dom = Blockly.utils.xml.textToDom(savedXml);
      Blockly.Xml.domToWorkspace(dom, ws);
    } catch {
      // Ignore parse errors on first load
    }

    const onChange = (event: Blockly.Events.Abstract) => {
      if (
        event.isUiEvent ||
        event.type === Blockly.Events.VIEWPORT_CHANGE ||
        event.type === Blockly.Events.TOOLBOX_ITEM_SELECT
      ) {
        return;
      }
      const xml = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(ws));
      dispatch(setXml(xml));
      try {
        const code = generateMicroPython(ws);
        dispatch(setGeneratedCode(code));
        // Auto-save to localStorage on every meaningful change
        const state = { xml, generatedCode: code };
        localStorage.setItem('geneo-iot-workspace', JSON.stringify(state));
      } catch (err) {
        console.warn('Code generation error:', err);
      }
    };

    ws.addChangeListener(onChange);

    const resizeObserver = new ResizeObserver(() => Blockly.svgResize(ws));
    resizeObserver.observe(divRef.current);

    return () => {
      ws.removeChangeListener(onChange);
      resizeObserver.disconnect();
      ws.dispose();
      workspaceRef.current = null;
    };
    // Run only once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Wire run button to executor
  useBlocklyExecution(() => workspaceRef.current);

  return <div ref={divRef} className="blockly-div" />;
}
