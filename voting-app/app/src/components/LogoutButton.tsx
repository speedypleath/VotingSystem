import { useState } from 'react'
import styled from 'styled-components';

const Button = styled.button`
  color: darkgrey;
  border: 2px solid gray;
  font-size: 2em;
  
  &:hover {
    opacity: 0.9;
  }
`

export function LogoutButton({ onClick } : { onClick: () => void }) {
    return(
        <div onClick={onClick}>
            <Button>
                Log Out
            </Button>
        </div>
    );
}