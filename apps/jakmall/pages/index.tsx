import { useState, useEffect, useMemo } from 'react'
import { useForm, Controller, useWatch } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import styled from 'styled-components'
import styles from './index.module.styl';
import { useRouter } from 'next/router'
import Spinner from 'components/Spinner'
import BackButton from 'components/BackButton'
import Checkbox from 'components/Inputs/Checkbox'
import TextField from 'components/Inputs/TextField'
import TextArea from 'components/Inputs/TextArea'
import Select from 'components/Inputs/Select'
import Button from 'components/Inputs/Button'
import useDidUpdateEffect from 'lib/useDidUpdateEffect'
import thousandSeparator from 'lib/formatter/thousandSeparator'
import shipmentEnum from 'lib/constant/shipmentEnum'
import paymentEnum from 'lib/constant/paymentEnum'
import randomID from 'lib/generator/randomID'

const ProgressBarCircle = styled.div`
  border-radius: 9999px;
  width: 35px;
  height: 35px;
  background: ${props => props.primary ? props.theme.bgColor.main : '#ffd29c'};
  color: ${props => props.primary ? 'white' : props.theme.bgColor.main};
`

const OrangeText = styled.div`
  font-weight: bold;
  font-size: ${props => props.huge ? "30px" : props.big ? "24px" : "18px"};
  color: ${props => props.theme.bgColor.main};
`
const GreenText = styled.div`
  font-weight: bold;
  font-size: ${props => props.big ? "24px" : "18px"};
  color: ${props => props.theme.bgColor.green};
`

export async function getStaticProps(context) {
  return {
    props: {
      qty: 10,
      price: 50_000,
      dropshipperFee: 5900,
    },
  }
}

const phoneRegExp = /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/
const schemaDelivery = yup.object({
  email: yup.string().email().required(),
  phoneNumber: yup.string().min(6).max(20).matches(phoneRegExp, 'Phone number is not valid').required(),
  address: yup.string().max(120).required(),
  isDropshipper: yup.boolean(),
  dropshipperName: yup.string().when('isDropshipper', {
    is: false,
    otherwise: (s) => s.required(),
  }),
  dropshipperPhoneNumber: yup.string().when('isDropshipper', {
    is: false,
    otherwise: (s) => s.min(6).max(20).matches(phoneRegExp, 'Phone number is not valid').required(),
  }),
});

const schemaShipment = yup.object({
  shipmentSelected: yup.mixed().required(),
  paymentSelected: yup.mixed().required(),
})

const defaultValuesDelivery = {
  email: '',
  phoneNumber: '',
  address: '',
  isDropshipper: false,
  dropshipperName: '',
  dropshipperPhoneNumber: '',
}
const defaultValuesShipment = {
  shipmentSelected: null,
  paymentSelected: null,
}

const URLConf = {
  delivery: {
    paper: 'delivery',
    asPath: '/?paper=delivery',
  },
  shipment: {
    paper: 'shipment',
    asPath: '/?paper=shipment',
  },
  thankyou: {
    paper: 'thankyou',
    asPath: '/?paper=thankyou',
  },
}

export function Index(props) {
  const router = useRouter()
  const { paper: paperParam, clearForm: clearFormParam }: any = router.query

  const { reset, resetField, control, register, handleSubmit, formState: { errors }, getValues } = useForm({
    mode: 'all',
    resolver: yupResolver(schemaDelivery),
    defaultValues: defaultValuesDelivery,
  });
  const formHookShipment = useForm({
    mode: 'all',
    resolver: yupResolver(schemaShipment),
    defaultValues: defaultValuesShipment,
  });

  useEffect(() => {
    if (clearFormParam) {
      reset(defaultValuesDelivery);
      formHookShipment.reset(defaultValuesShipment);
      router.replace(URLConf[paperParam].asPath)
    }
  }, [clearFormParam])


  useEffect(() => {
    // const handleRouteChange = (url, { shallow }) => {
    //   console.log(url)
    //   if(url === URLConf.delivery.asPath && shallow) {
    //     // console.log('reset wooo')
    //     // reset(defaultValuesDelivery);
    //     // formHookShipment.reset(defaultValuesShipment);
    //   }
    // }

    // router.events.on('routeChangeComplete', handleRouteChange)

    const initAsyncEffect = async () => {
      const encryptStorage = await import('lib/encryptStorage').then(theFile => theFile.default)

      const deliverySavedState = encryptStorage.getItem('delivery')
      const shipmentSavedState = encryptStorage.getItem('shipment')
      if (deliverySavedState)
        reset(deliverySavedState)
      if (shipmentSavedState)
        formHookShipment.reset(shipmentSavedState)

      const saveAllToStorage = (event) => {
        encryptStorage.setItem('delivery', getValues())
        encryptStorage.setItem('shipment', formHookShipment.getValues())
      }
      window.addEventListener('beforeunload', saveAllToStorage)
    }
    initAsyncEffect()
    return () => {
      // window.removeEventListener('beforeunload', saveAllToStorage)
      // router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [])


  useEffect(() => {
    console.log(router)
    if (router.isReady) {
      if (!paperParam) {
        router.push(URLConf.delivery.asPath, undefined, { shallow: true })
      }
      else {
      }
    }
  }, [router.isReady, paperParam])

  const isDropshipper = useWatch({ control, name: 'isDropshipper' })
  const shipmentSelected = useWatch({ control: formHookShipment.control, name: 'shipmentSelected' })
  const paymentSelected = useWatch({ control: formHookShipment.control, name: 'paymentSelected' })

  useDidUpdateEffect(() => {
    if (!isDropshipper) {
      resetField('dropshipperName')
      resetField('dropshipperPhoneNumber')
    }
  }, [isDropshipper])

  const pageConf = useMemo(() => {
    if (!router.isReady) return;
    let finalConf

    switch (paperParam) {
      case 'delivery':
        finalConf = {
          paperParam,
          formComp: (props) => <form onSubmit={handleSubmit(data => router.push(URLConf.shipment.asPath, undefined, { shallow: true }))} className='flex flex-auto gap-8 mt-4' {...props} />,
          // handleSubmit: handleSubmit(data => router.push(URLConf.shipment.asPath, undefined, { shallow: true })),
          title: 'Delivery Details',
          progressBarStep: [true, false, false],
          backButton: <BackButton onClick={() => { }}>Back to cart</BackButton>,
          paymentMethodComp: null,
          buttonText: "Continue to Payment",
        }
        break;
      case 'shipment':
        finalConf = {
          paperParam,
          formComp: (props) => <form onSubmit={formHookShipment.handleSubmit(data => { router.push(URLConf.thankyou.asPath, undefined, { shallow: true }); })} className='flex flex-auto gap-8 mt-4' {...props} />,
          // handleSubmit: formHookShipment.handleSubmit(data => { router.push(URLConf.thankyou.asPath, undefined, { shallow: true }); }),
          title: null,
          progressBarStep: [true, true, false],
          backButton: <BackButton onClick={() => { router.back(); formHookShipment.reset() }} ></BackButton>,
          paymentMethodComp: null,
          buttonText: shipmentEnum[shipmentSelected] && paymentEnum[paymentSelected] ? "Pay with " + paymentEnum[paymentSelected].label : null,
        }
        break;
      case 'thankyou':
        finalConf = {
          paperParam,
          formComp: (props) => <form onSubmit={() => { }} className='flex flex-auto gap-8 mt-4' {...props} />,
          // handleSubmit: () => { },
          title: 'Thank You',
          progressBarStep: [true, true, true],
          generatedOrderID: randomID(),
          backButton: <BackButton onClick={() => {
            router.push(`${URLConf.delivery.asPath}&clearForm=true`, undefined, { shallow: true });
          }}>Go To Homepage</BackButton>,
          paymentMethodComp: (
            <>
              <hr className='horizontalSeparator' />
              <div>Payment Method</div>
              <GreenText>
                {paymentEnum[paymentSelected].label}
              </GreenText>
            </>
          ),
          buttonText: null,
        }
        break;

      default:
        break;
    }
    return finalConf
  }, [paperParam, shipmentSelected, paymentSelected])

  const totalFinal = useMemo(() => props.qty * props.price + props.dropshipperFee * +isDropshipper + (shipmentEnum[shipmentSelected] ? shipmentEnum[shipmentSelected].price : 0), [props.qty, props.price, props.dropshipperFee, isDropshipper, shipmentSelected])

  return (
    <div className={styles.page}>
      <div className="wrapper">
        <div className="container">
          {pageConf != null
            ? (<>
              <div className='progress-bar flex justify-evenly items-center'>
                {['Delivery', 'Payment', 'Finish'].map((text, i) => (
                  <div className='flex items-center' key={text}>
                    <ProgressBarCircle primary={pageConf.progressBarStep[i]} className='flex justify-center items-center'>
                      <div>{i + 1}</div>
                    </ProgressBarCircle>
                    <div className='dark-orange ml-2'>
                      {text}
                    </div>
                    {i !== pageConf.progressBarStep.length - 1 && <span className="material-symbols-outlined ml-7 dark-orange">
                      navigate_next
                    </span>}
                  </div>
                ))}
              </div>
              {paperParam !== URLConf.thankyou.paper && pageConf.backButton}
              <pageConf.formComp>
                {pageConf.paperParam === URLConf.delivery.paper
                  ? (<div id='leftMain' className='flex flex-wrap flex-1 gap-7'>
                    <div className='deliveryLeft'>
                      <OrangeText huge>
                        {pageConf.title}
                      </OrangeText>
                      <div className='flex flex-col gap-4 mt-7'>
                        <Controller
                          name="email"
                          control={control}
                          render={({ field, fieldState }) => <TextField label="Email" fieldState={fieldState} {...field} />}
                        />
                        <Controller
                          name="phoneNumber"
                          control={control}
                          render={({ field, fieldState }) => <TextField label="Phone Number" fieldState={fieldState} {...field} />}
                        />
                        <Controller
                          name="address"
                          control={control}
                          render={({ field, fieldState }) => <TextArea label="Address" fieldState={fieldState} {...field} />}
                        />
                      </div>
                    </div>
                    <div className='deliveryRight'>
                      <div>
                        <div className='flex justify-end items-center' style={{ height: 45 }}>
                          <Checkbox label="Send as Dropshipper" {...register("isDropshipper")} />
                        </div>
                        <div className='flex flex-col gap-4 mt-7'>
                          <Controller
                            name="dropshipperName"
                            control={control}
                            render={({ field, fieldState }) => <TextField disabled={!isDropshipper} label="Dropshipper Name" fieldState={fieldState} {...field} />}
                          />
                          <Controller
                            name="dropshipperPhoneNumber"
                            control={control}
                            render={({ field, fieldState }) => <TextField disabled={!isDropshipper} label="Dropshipper Phone Number" fieldState={fieldState} {...field} />}
                          />
                        </div>
                      </div>
                    </div>
                  </div>)
                  : pageConf.paperParam === 'shipment' ? (
                    // --------------------------------------------------------------------------------------SHIPMENT
                    <div id='leftMain' className='flex-1'>
                      <div className='mb-14'>
                        <Controller
                          name="shipmentSelected"
                          control={formHookShipment.control}
                          render={({ field, fieldState }) => <Select label="Shipment" options={shipmentEnum} fieldState={fieldState} {...field} />}
                        />
                      </div>
                      <Controller
                        name="paymentSelected"
                        control={formHookShipment.control}
                        render={({ field, fieldState }) => <Select label="Payment" options={paymentEnum} fieldState={fieldState} {...field} />}
                      />
                    </div>
                  ) : (
                    // ------------------------------------------------------------------------------------THANK YOU
                    <div id='leftMain' className='flex justify-center items-center flex-1 gap-7'>
                      <div>
                        <OrangeText huge>
                          {pageConf.title}
                        </OrangeText>
                        <div className='mt-8 font-bold'>
                          Order ID: {pageConf.generatedOrderID}
                        </div>
                        <div className='mb-12'>
                          Your order will be delivered {shipmentEnum[shipmentSelected].estimation} with {shipmentEnum[shipmentSelected].label}
                        </div>
                        {pageConf.backButton}
                      </div>
                    </div>
                  )}
                <div className='separator'></div>
                <div id='rightMain' className='flex flex-col justify-between'>
                  <div className='topSummary'>
                    <OrangeText big>
                      Summary
                    </OrangeText>
                    <div className='mt-2 text-sm text-gray-500'>{props.qty} items purchased</div>
                    {shipmentSelected != null && (
                      <>
                        <hr className='horizontalSeparator' />
                        <div>Delivery Estimation</div>
                        <GreenText>
                          {`${shipmentEnum[shipmentSelected].estimation} by ${shipmentEnum[shipmentSelected].label}`}
                        </GreenText>
                      </>
                    )}
                    {pageConf.paymentMethodComp}
                  </div>
                  <div className='bottomSummary'>
                    <div className='flex justify-between'>
                      <div>Cost of goods</div>
                      <div className='font-bold'>{thousandSeparator(props.qty * props.price)}</div>
                    </div>
                    {isDropshipper && <div className='flex justify-between'>
                      <div>Dropshipping Fee</div>
                      <div className='font-bold'>{thousandSeparator(props.dropshipperFee)}</div>
                    </div>}
                    {shipmentSelected != null && <div className='flex justify-between'>
                      <div><span className='font-bold'>{shipmentEnum[shipmentSelected].label}</span> shipment</div>
                      <div className='font-bold'>{shipmentEnum[shipmentSelected].formattedPrice}</div>
                    </div>}
                    <OrangeText big className="flex justify-between my-4">
                      <div>Total</div>
                      <div>{thousandSeparator(totalFinal)}</div>
                    </OrangeText>
                    {pageConf.buttonText && <Button type="submit">
                      {pageConf.buttonText}
                    </Button>}
                  </div>
                </div>
              </pageConf.formComp>
            </>)
            : <Spinner />}
        </div>
      </div>
    </div>
  );
}

// const DynamicIndex = dynamic(
//   {
//     loader: () => import('lib/encryptStorage'),
//     render: Index,
//   },
//   {
//     ssr: false
//   }
// )

export default Index;
