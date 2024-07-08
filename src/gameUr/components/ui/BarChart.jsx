import { Bar } from 'react-chartjs-2';
import SoftenedDiv from '../../styles/SoftenedDiv.style';
import styled from 'styled-components';
import { normalize } from '../../util/helper';
import { useAppContext } from '../../contexts/Context';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);


const barChartData = {
    labels: ["0", "1", "2", "3", "4"],

    datasets: [
        {
            label: "Dice Roll Frequency",
            // data: normalize(appState.diceFrequency),
            backgroundColor: ["rbga(255, 99, 132, 0.2)"],
            borderColor: ["rgba(54, 162, 235, 1)"],
            borderWidth: 1
        }
    ]
}

const BarChart = () => {

const {appState}  = useAppContext()

    const options = {};
    
    const data = {
        ...barChartData,
        datasets: [
            {
                ...barChartData.datasets[0],
                data: normalize(appState.diceFrequency)
            }
        ]
    };
    
    return (
        <>
            <Bar options={options} data={data}/>
        </>
    );
};

export default BarChart;