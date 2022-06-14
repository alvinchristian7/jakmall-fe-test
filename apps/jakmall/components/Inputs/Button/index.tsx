import React, { useMemo } from 'react'
import styled, { css } from 'styled-components'

const Button = styled.button`
  width: 100%;
  padding: 18px;
  font-size: 20px;
  background-color: ${props => props.theme.bgColor.orange};
  color: white;
  border-radius: 4px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px;
`

const TextField = React.forwardRef(({ label, gotError, width, ...props }: any, ref) => {
  return (
    <Button {...props} ref={ref} />
  )
})

export default TextField