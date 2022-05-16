import React, { useMemo } from 'react'
import styled, { css } from 'styled-components'
import cn from 'classnames'
import Button from 'components/Inputs/Button'

const InputOption = styled.div`
  display: flex;
  justify-content: space-between;
  & * {
    transition: all .3s ease;
  }
  & input[type="checkbox"] {
    display: none;
  }

  & > label {
    display: inline-block;
    min-width: 200px;
    min-height: 72px;
    border-radius: 3px;
    & input[type="checkbox"]:not(:checked) + div:hover {
      background: ${props => props.theme.bgColor.greyBorder};
    }
  }

  & .selectionBox {
    height: 100%;
    border-radius: 4px;
    border: 2px solid ${props => props.theme.bgColor.greyBorder};
    padding: 10px;
  }
  & input[type="checkbox"]:checked + div {
    border: 2px solid ${props => props.theme.bgColor.green};
    & .material-symbols-outlined {
      color: ${props => props.theme.bgColor.green};
    }
  }
// width: 100%;
// padding: 18px;
// font-size: 20px;
// background-color: ${props => props.theme.bgColor.orange};
// color: white;
// border-radius: 4px;
// box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px;
`
const OrangeText = styled.div`
  font-weight: bold;
  font-size: ${props => props.huge ? "30px" : props.big ? "24px" : "18px"};
  color: ${props => props.theme.bgColor.main};
`
const TextField = React.forwardRef(({ label, options = [], fieldState: { invalid, isTouched, isDirty, error }, ...rest }: any, ref) => {
  const isValidObj = useMemo(() => isTouched || rest.value != null && !invalid ? {
    valid: true,
    symbol: (isSelected) => (<span className={cn("material-symbols-outlined", { 'hidden': !isSelected })}>
      check
    </span>),
  } : {
    valid: false,
    symbol: () => null,
  }, [isTouched, rest.value, invalid])
  
  return (
    <div>
      <OrangeText huge className='mb-7'>{label}</OrangeText>
      <InputOption>
        {options.map(obj => (
          <label key={obj.value}>
            <input type="checkbox" checked={rest.value === obj.value} name={rest.name} onChange={event => rest.onChange(obj.value)} value={obj.value}/>
            <div className="selectionBox flex justify-between items-center relative">
              <div>
                <div>
                  {obj.label}
                </div>
                <div>
                  {obj.formattedPrice}
                </div>
              </div>
              {isValidObj.symbol(rest.value === obj.value)}
            </div>
          </label>
        ))}
      </InputOption>
    </div>
  )
})

export default TextField