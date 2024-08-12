import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const Home = () => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            gap: '5px' // Adjust the value as per your desired gap size
        }}>
            <h1>Home</h1>
            <Link to="/files"><Button>File Structure</Button></Link>
            <Link to="/ur"><Button>Game of Ur</Button></Link>
            <Link to="/beamsearch"><Button>Beam Search Visualizer</Button></Link>
        </div>
    );
}