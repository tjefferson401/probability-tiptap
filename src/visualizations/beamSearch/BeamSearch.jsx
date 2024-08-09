import { PyodideContext } from '../../pyodide/PyodideProvider';
import { BeamSearchVis } from './BeamSearchVis';
import Loading from './Loading';
import { useContext } from 'react';

export const BeamSearch = () => {
  const { pyodideLoadingState } = useContext(PyodideContext);
  
  return (
    <div>
      {/* If Pyodide is not ready, display a loading spinner */}
      {pyodideLoadingState !== 'ready' ? (
        <Loading />
      ) : (
        <BeamSearchVis />
      )}
    </div>
  );
}