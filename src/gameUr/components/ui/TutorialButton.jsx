const TutorialButton = () => {
    return (
        <div style={{ position: 'relative' }}>
            <button 
                className="btn btn-primary rounded-circle p-3 lh-1" 
                type="button" 
                style={{
                    position: 'absolute',
                    bottom: '10px', // Adjust as needed
                    right: '10px',  // Adjust as needed
                }}
            >
                <svg className="bi" width="24" height="24"><use xlinkHref="#x-lg"></use></svg>
                <span className="visually-hidden">Dismiss</span>
            </button>
        </div>
    );
}

export default TutorialButton;