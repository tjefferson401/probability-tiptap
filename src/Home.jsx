import { Button } from 'react-bootstrap';

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
            <Button onClick={() => window.location.href = '/files'}>File Structure</Button>
            <Button onClick={() => window.location.href = '/ur'}>The Game of Ur</Button>
            <Button onClick={() => window.location.href = '/beamsearch'}>Beam Search Visualizer</Button>
        </div>
    );
}