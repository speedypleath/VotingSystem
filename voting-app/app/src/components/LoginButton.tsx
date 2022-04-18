import { useState } from 'react'
import styled from 'styled-components';

const Button = styled.button`
  color: black;
  border: 2px solid gray;
  font-size: 1.4em;
  width: 65vh;
  &:hover {
    opacity: 0.9;
  }
`

export function LoginButton({ onClick} : { onClick: () => void }) {
    return(
        <div onClick={onClick}>
            <Button>
                <a className="App-link" rel="noopener noreferrer">
                    Log In
                </a>
            </Button>
        </div>
    );
}