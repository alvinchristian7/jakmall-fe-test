import React from 'react'
import styled from 'styled-components'

const InputCheckbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
  transition: all .2s ease;
  &:hover, &:checked {
    background-color: ${props => props.theme.bgColor.green};
  }
`

const Checkbox = React.forwardRef(({ label, ...props }: any, ref) => (
  <div className='inline-flex items-center'>
    <InputCheckbox type="checkbox" {...props} ref={ref}/>
    <label className='ml-2 font-semibold text-sm'>{label}</label>
  </div>
))

export default Checkbox