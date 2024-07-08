import styled from "styled-components";

const StyledHeader = styled.div`
    color: white;
    background-color: lightblue;
    display: flex;
    top: 0;
    left: 0;
    width: 100%;
    margin-bottom: 20px;
`;

const Heading = () => {
    return (
        <StyledHeader>
            <h1>The Game of Ur</h1>
        </StyledHeader>
    );
}

export default Heading;