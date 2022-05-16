import React, { useMemo } from 'react'
import styled, { css } from 'styled-components'
import cn from 'classnames'

const InputText = styled.div`
  &.valid, &:focus-within {
    & label {
      color: ${props => props.theme.bgColor.green};
      transform: translate(0px, -12px) scale(.85);
    }
    & input {
      border-color: ${props => props.theme.bgColor.green};
    }
    & span {
      color: ${props => props.theme.bgColor.green};
    }
  }
  &.invalid {
    & label {
      color: ${props => props.theme.bgColor.orange};
      transform: translate(0px, -12px) scale(.85);
    }
    & input {
      border-color: ${props => props.theme.bgColor.orange};
    }
    & span {
      color: ${props => props.theme.bgColor.orange};
    }
  }
  & span {
    transition: all .2s ease;
  }
  & label {
    position: absolute;
    color: ${props => props.theme.bgColor.placeholder};
    padding-left: 12px;
    transition: all .2s ease;
  }
  & input {
    width: 100%;
    height: 60px;
    padding: 25px 36px 8px 12px;
    font-size: 1.1em;
    outline: none;
    border: 1px solid #CCCCCC;
    transition: all .2s ease;
    // &:hover {
    //   border-color: black;
    // }
  }
`

const TextField = React.forwardRef(({ label, width, fieldState: { invalid, isTouched, isDirty, error }, ...props }: any, ref) => {
  const isValidOrNot = useMemo(() => isTouched || props.value ? (invalid ? {
    className: 'invalid', symbol: <span className="absolute right-0 mr-3 material-symbols-outlined">
      close
    </span>
  } : {
    className: 'valid', symbol: <span className="absolute right-0 mr-3 material-symbols-outlined">
      check
    </span>
  }) : { symbol: null }, [isTouched, props.value, invalid])

  return (
    <InputText width={width} className={cn('flex items-center relative', isValidOrNot.className)}>
      <label className='absolute'>{label}</label>
      <input type="text" {...props} ref={ref} />
      {isValidOrNot.symbol}
    </InputText>
  )
})

export default TextField