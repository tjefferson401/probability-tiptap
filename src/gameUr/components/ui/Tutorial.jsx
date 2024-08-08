import { useAppContext } from "../../contexts/Context";
import Dispatcher from "../../util/Dispatcher";
import tutorialIcon from "../../../assets/react.svg";

// const styles = {
//     container: {
//         background: 'url("path/to/your/parchment-background.jpg") no-repeat center center fixed',
//         backgroundSize: 'cover',
//         padding: '20px',
//         border: '2px solid #8B4513',
//         borderRadius: '10px',
//         boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
//         maxWidth: '800px',
//         margin: 'auto',
//         textAlign: 'left',
//         fontFamily: "'Papyrus', 'Cursive', sans-serif",
//         backgroundColor: '#F5F5DC',
//         color: '#4B3621',
//     },
//     heading: {
//         fontSize: '2em',
//         marginBottom: '10px',
//     },
//     paragraph: {
//         fontSize: '1.2em',
//         lineHeight: '1.5',
//         marginBottom: '20px',
//     },
//     button: {
//         backgroundColor: '#8B4513',
//         color: '#FFFFFF',
//         border: 'none',
//         padding: '10px 20px',
//         fontSize: '1.2em',
//         cursor: 'pointer',
//         borderRadius: '5px',
//         transition: 'background-color 0.3s ease',
//     },
//     buttonHover: {
//         backgroundColor: '#A0522D',
//     },
//     tutorialButton: {
//         position: 'absolute',
//         bottom: '10px', // Adjust as needed
//         right: '10px',  // Adjust as needed
//     },
//     tutorialIcon: {
//         width: '24px',
//         height: '24px',
//     },
// };

// export const Tutorial = () => {
//     const { dispatch } = useAppContext();

//     return (
//         <div style={styles.container}>
//             <h1 style={styles.heading}>How to Play</h1>
//             <p style={styles.paragraph}>
//                 The Royal Game of Ur is a two-player strategy game originating from ancient Mesopotamia around 2600 BCE.
//             </p>

//             <h1 style={styles.heading}>Objective</h1>
//             <p style={styles.paragraph}>
//                 Be the first player to move all seven of your pieces off the board.
//             </p>

//             <h1 style={styles.heading}>Gameplay</h1>

//             <p style={styles.paragraph}>
//                 Players will take turns rolling the dice and moving their pieces across the board. If a player lands on a rosette, they are allowed to take an extra turn.
//                 If a player lands on a space occupied by an opponent, the opponent's piece is sent back to the start. The only exception to this is the middle rosette, deemed as a safe space.
//                 If there is not a valid move to be made, the turn goes to the opposition. Pieces move in a directed path, and must be moved off the board in the direction of the player's home row.
//                 The first player to move all seven of their pieces off the board wins.
//             </p>

//             <button 
//                 style={styles.button} 
//                 onClick={() => dispatch(Dispatcher.toggleTutorial())}
//                 onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor}
//                 onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.button.backgroundColor}
//             >
//                 Are you ready to play the Royal Game of Ur?
//             </button>
//         </div>
//     );
// }

// export const TutorialButton = () => {
//     const { dispatch } = useAppContext();
//     return (
//         <div style={{ position: 'relative' }}>
//             <button 
//                 className="btn btn-primary rounded-circle p-3 lh-1" 
//                 type="button" 
//                 onClick={() => dispatch(Dispatcher.toggleTutorial())}
//                 style={{
//                     position: 'absolute',
//                     bottom: '10px', // Adjust as needed
//                     right: '10px',  // Adjust as needed
//                 }}
//             >
//                 <img src={tutorialIcon} alt="Tutorial Icon" style={{ width: '24px', height: '24px' }} />
//             </button>
//         </div>
//     );
// }

const styles = {
    body: {
        fontFamily: "'Papyrus', 'Cursive', sans-serif",
        backgroundColor: '#D3D3D3', // A light grey background color that pops
        margin: 0,
        padding: 0,
        height: '100vh', // Ensure the body height covers the full viewport height
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        background: 'url("path/to/your/parchment-background.jpg") no-repeat center center fixed',
        backgroundSize: 'cover',
        padding: '20px',
        border: '2px solid #8B4513',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
        maxWidth: '800px',
        width: '80%', // Ensure the container width adjusts to the screen size
        textAlign: 'left',
        fontFamily: "'Papyrus', 'Cursive', sans-serif",
        backgroundColor: '#F5F5DC',
        color: '#4B3621',
        height: '100%', // Ensure the container height covers the full content height
        overflow: 'auto', // Add scrolling if content overflows
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between', // Center content vertically
    },
    heading: {
        fontSize: '2em',
        marginBottom: '10px',
    },
    paragraph: {
        fontSize: '1.2em',
        lineHeight: '1.5',
        marginBottom: '20px',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center', // Center the button horizontally
        marginTop: '20px',
    },
    button: {
        backgroundColor: '#8B4513',
        color: '#FFFFFF',
        border: 'none',
        padding: '15px 30px', // Increased padding to make the button bigger
        fontSize: '1.5em', // Increased font size to make the button text bigger
        cursor: 'pointer',
        borderRadius: '5px',
        transition: 'background-color 0.3s ease',
    },
    buttonHover: {
        backgroundColor: '#A0522D',
    },
    tutorialButton: {
        position: 'absolute',
        bottom: '10px', // Adjust as needed
        right: '10px',  // Adjust as needed
    },
    tutorialIcon: {
        width: '24px',
        height: '24px',
    },
};


export const Tutorial = () => {
    const { dispatch } = useAppContext();

    return (
        <div style={styles.body}>
            <div style={styles.container}>
                <div>
                    <h1 style={styles.heading}>How to Play</h1>
                    <p style={styles.paragraph}>
                        The Royal Game of Ur is a two-player strategy game originating from ancient Mesopotamia around 2600 BCE.
                    </p>

                    <h1 style={styles.heading}>Objective</h1>
                    <p style={styles.paragraph}>
                        Be the first player to move all seven of your pieces off the board.
                    </p>

                    <h1 style={styles.heading}>Gameplay</h1>

                    <p style={styles.paragraph}>
                        Players will take turns rolling the dice and moving their pieces across the board. If a player lands on a rosette, they are allowed to take an extra turn.
                        If a player lands on a space occupied by an opponent, the opponent's piece is sent back to the start. The only exception to this is the middle rosette, deemed as a safe space.
                        If there is not a valid move to be made, the turn goes to the opposition. Pieces move in a directed path, and must be moved off the board in the direction of the player's home row.
                        The first player to move all seven of their pieces off the board wins.
                    </p>

                    <button 
                        style={styles.button} 
                        onClick={() => dispatch(Dispatcher.toggleTutorial())}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.button.backgroundColor}
                    >
                        Are you ready to play the Royal Game of Ur?
                    </button>
                </div>
            </div>
        </div>
    );
}

export const TutorialButton = () => {
    const { dispatch } = useAppContext();
    return (
        <div style={{ position: 'relative' }}>
            <button 
                className="btn btn-primary rounded-circle p-3 lh-1" 
                type="button" 
                onClick={() => dispatch(Dispatcher.toggleTutorial())}
                style={styles.tutorialButton}
            >
                <img src={tutorialIcon} alt="Tutorial Icon" style={styles.tutorialIcon} />
            </button>
        </div>
    );
}
