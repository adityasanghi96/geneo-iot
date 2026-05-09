import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setProject } from '../store/slices/projectSlice';
import { setXml, setGeneratedCode } from '../store/slices/workspaceSlice';
import { LOCAL_STORAGE_KEY } from '../config';

interface ProjectFile {
  version: string;
  meta: { name: string; author: string; description: string };
  workspace: { xml: string; generatedCode: string };
  savedAt: string;
}

export function useProject() {
  const dispatch = useAppDispatch();
  const project = useAppSelector((s) => s.project);
  const workspace = useAppSelector((s) => s.workspace);

  const buildProjectFile = useCallback((): ProjectFile => {
    return {
      version: '1.0',
      meta: { ...project },
      workspace: { ...workspace },
      savedAt: new Date().toISOString(),
    };
  }, [project, workspace]);

  const saveToLocalStorage = useCallback(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(buildProjectFile()));
    } catch {
      console.warn('Could not save to localStorage');
    }
  }, [buildProjectFile]);

  const loadFromLocalStorage = useCallback(() => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!raw) return false;
      const data: ProjectFile = JSON.parse(raw);
      dispatch(setProject(data.meta));
      dispatch(setXml(data.workspace.xml));
      dispatch(setGeneratedCode(data.workspace.generatedCode));
      return true;
    } catch {
      return false;
    }
  }, [dispatch]);

  const exportJSON = useCallback(() => {
    const blob = new Blob([JSON.stringify(buildProjectFile(), null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.replace(/\s+/g, '_')}.geneo.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [buildProjectFile, project.name]);

  const exportPython = useCallback(() => {
    const blob = new Blob([workspace.generatedCode], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'main.py';
    a.click();
    URL.revokeObjectURL(url);
  }, [workspace.generatedCode]);

  const importJSON = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data: ProjectFile = JSON.parse(e.target?.result as string);
          dispatch(setProject(data.meta));
          dispatch(setXml(data.workspace.xml));
          dispatch(setGeneratedCode(data.workspace.generatedCode));
        } catch {
          console.error('Invalid project file');
        }
      };
      reader.readAsText(file);
    },
    [dispatch]
  );

  return { saveToLocalStorage, loadFromLocalStorage, exportJSON, exportPython, importJSON };
}
