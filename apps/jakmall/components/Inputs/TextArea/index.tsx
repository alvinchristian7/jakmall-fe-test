import React, { useMemo } from 'react'
import styled, { css } from 'styled-components'
import cn from 'classnames'

const InputText = styled.div`
  &.valid, &:focus-within {
    & label {
      color: ${props => props.theme.bgColor.green};
      transform: translate(0px, -12px) scale(.85);
    }
    & textarea {
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
    & textarea {
      border-color: ${props => props.theme.bgColor.orange};
    }
    & span {
      color: ${props => props.theme.bgColor.orange};
    }
  }
  & span.material-symbols-outlined {
    transition: all .2s ease;
    padding-top: 15px;
  }
  & span.counter {
    position: absolute;
    right: 9px;
    bottom: 8px;
    color: #aaa;
    z-index: 3;
    background: #eee;
    border-radius: 3px;
    font-size: 13px;
    width: 24px;
    height: 21px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    text-align: center;
  }
  & label {
    position: absolute;
    color: ${props => props.theme.bgColor.placeholder};
    padding-top: 16px;
    padding-left: 12px;
    transition: all .2s ease;
  }
  & textarea {
    width: 100%;
    // height: 60px;
    padding: 25px 36px 8px 12px;
    font-size: 0.9em;
    outline: none;
    border: 1px solid #CCCCCC;
    transition: all .2s ease;
    // &:hover {
    //   border-color: black;
    // }
  }
`

const maxLength = 120

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
    <InputText width={width} className={cn('flex relative', isValidOrNot.className)}>
      <label className='absolute'>{label}</label>
      <textarea cols={30} rows={4} maxLength={maxLength} {...props} ref={ref} />
      {isValidOrNot.symbol}
      <span className='counter'>{maxLength - props.value.length}</span>
    </InputText>
  )
})

export default TextField