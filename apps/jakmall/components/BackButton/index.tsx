import React from 'react'
import styled, { css } from 'styled-components'

const HyperNoLink = styled.a`
  display: inline-flex;
  align-items: center;
`

function BackButton(props) {
  return (
    <div>
      <HyperNoLink onClick={props.onClick}><span className="material-symbols-outlined">
        west
      </span><div className='ml-3'>{props.children}</div></HyperNoLink>
    </div>
  )
}

export default BackButton