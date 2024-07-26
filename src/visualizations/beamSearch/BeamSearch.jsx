import { PyodideContext } from '../../pyodide/PyodideProvider';
import { BeamSearchVis } from './BeamSearchVis';
import Loading from './Loading';
import { useContext } from 'react';

export const BeamSearch = () => {
  const { pyodideLoadingState } = useContext(PyodideContext);
  
  return (
    <div>
      {pyodideLoadingState !== 'ready' ? (
        <Loading />
      ) : (
        <BeamSearchVis />
      )}
    </div>
  );
}