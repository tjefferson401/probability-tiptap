import { HashLoader } from 'react-spinners';

const Loading = () => {
return (
    <div className="loading" style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "white"
    }}>
        <HashLoader
            color={"#42a5f5"}
            loading={true}
            speedMultiplier={0.85}
            size={100}
        />
    </div>
)
}

export default Loading;