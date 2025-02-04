// pages/produce-list.js
import React, {useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useProduce } from './context/ProduceContext';
import { useSwitch } from '@nextui-org/react';
import { Stack, Autocomplete, TextField, Button, MenuItem, Select, accordionSummaryClasses } from "@mui/material"
import Snackbar1 from '@mui/material/Snackbar';
import queryString from 'query-string';
import { Questrial } from 'next/font/google';
import QuantitySelector from './QuantitySelector';
import SendEmail from './SendEmail';
import axios from 'axios';
import Navbar from '@/components/Navbar';

const ProduceList = () => {
  const { updateProduceList, userCurrentOrder, updateUserOrder, updateTotalBalance, totalBalance,clearOrder, updateCurrentBalance,toggleSubmitButtonClicked,submitButtonClicked} = useProduce();
  const router = useRouter();
  // const { order } = router.query;
  const [produceItems, setProduceItems] = useState([])
  const [listItems, setListItems]=useState([])
  const [editIndex, setEditIndex]=useState(null)
  const [qtyIndex, setQtyIndex]=useState(null)
  const [value, setValue]=useState('')
  const [valueQty, setValueQty]=useState(null)
  const [editButtonIndex, setEditButtonIndex]=useState(null)
  const [deleteButtonIndex, setDeleteButtonIndex]=useState(null)
  const [isDisabled, setIsDisabled]=useState(false)
  const [quantity, setQuantity]=useState('')
  const [isCustomQuantity,setIsCustomQuantity]=useState(false)
  const [selectedQuantity, setSelectedQuantity] = useState('')
  const [submitButton, setSubmitButton]=useState(false)
  const [error, setError]=useState(null)
  const [customQty, setCustomQty]=useState(false)



  let quantityItems=[]
  let total_Balance=[]
  let grand_Total=[]
  let total=0.000
  let totalQ=0

  console.log("userCurrentOrder is ", userCurrentOrder)
  console.log("quantity is ", quantity)

  useEffect(()=>{
    const parsed=queryString.parse(window.location.search)

    const orderParam=parsed.order
    if (orderParam) {
      // setProduceItems(JSON.parse(decodeURIComponent(order)))
      try {
        const decodedOrder=decodeURIComponent(orderParam)
        const parsedOrder=JSON.parse(decodedOrder)
        setProduceItems(parsedOrder)
      } catch (error) {
        console.error("Failed to decode or parse order:", error)
      }
    }

    const prdcItmLst=parsed.prdcItmLst
    if(prdcItmLst){
      try {
        const decodedOrder=decodeURIComponent(prdcItmLst)
        const parsedProduceL=JSON.parse(decodedOrder)
        setListItems(parsedProduceL)
      } catch (error) {
                console.error("Failed to decode or parse produceList:", error)
      }
    }


  
  }, [])

  const toggleCustomQty=()=>{
    setCustomQty(!customQty)
  }

  const updateQty=()=>{
    toggleCustomQty()
  }

  const toggleSubmitButton=()=>{
    setSubmitButton(!submitButton)

  }

  const handleQuantityChange = (quantity,index,id) => {
    // setSelectedQuantity(quantity);
    console.log('Selected Quantity:', quantity, ",and index is ", index);

    // produceItems[index].Qty=quantity

    console.log("quantity is ", quantity, ",and is ", id)

    const updatedOrder = userCurrentOrder.map(item =>
      item.id === id ? { ...item, Qty: Number(quantity) } : item
    );
    updateUserOrder(updatedOrder);

    // produceItems[index].Qty=quantity

    userCurrentOrder[index].Qty=quantity
  }

  const handleQtyChange=(qty,Q,index,id)=>{

    console.log("qty is ", qty, ", index is ", index, ",and id is ", id)

    if (qty.length===0) {
      const updatedOrder = userCurrentOrder.map(item =>
        item.id === id ? { ...item, Qty: Number(quantity) } : item
      );
      updateUserOrder(updatedOrder);
  
      // produceItems[index].Qty=quantity
  
      userCurrentOrder[index].Qty=quantity
    }
    else{
      setQuantity(qty);
    }


  }
  const removeOutStocks=()=>{
    let index=0
    let tempValue=''
    let currentID=0

    console.log(listItems)

    while (listItems.length > index) {
      tempValue=listItems[index].stock
      if (tempValue===false) {
        console.log("For this produceItem ", listItems[index].name, " with the id of ", listItems[index].id, ", the stock is out")
        currentID=listItems[index].id
        setListItems(prevItems=>prevItems.filter(item=>item.id !== currentID))
      }
      index++
    }//end of while loop


  }

  const getQuantity=()=>{
    let index=0;
    let currentQuantity=0;


    while (produceItems.length > index) {
      if (produceItems[index].stock !==false) {
          quantityItems[index]=produceItems[index].Qty;
      }
      else{
        quantityItems[index]=0
      }

      index++;
    }//end of while loop

  }

  const getTotalQuantity=()=>{
    let index=0
    let tempValue1=0
    let tempValue2=0
    let tempTotalQnty=0

    getQuantity();

    while (quantityItems.length > index) {
        tempValue1=parseInt(quantityItems[index])
        tempTotalQnty=tempValue1+tempValue2
        tempValue2=tempTotalQnty

      index++
    }//end of while loop

    totalQ=tempTotalQnty

    // console.log(quantityItems)
    // console.log(totalQ)

    return totalQ

  }

  const calculateTotal=()=>{
    let tb=0
    let index=0;
    let tempPrice
    let tempQnty
    let tempTotal=0
    let tl=0
    let x=0
    let temp=0.00
    let temp2=0.00
    let currentTotal=0.00

    while (produceItems.length > index) {
      tempPrice=total_Balance[index];
      tempQnty=quantityItems[index];

      tempTotal= tempPrice*tempQnty
      grand_Total[index]=tempTotal;
      index++
    }//end of while loop

    while (grand_Total.length > x) {
      temp=grand_Total[x]
      total=temp+temp2
      temp2=total
      x++
    }//end of while loop

  }

  const getTotal=()=>{

    let index=0
    let qnty=0

    while(produceItems.length > index){

      if(produceItems[index].promo_price===0){
        total_Balance[index]=produceItems[index].case_cost
      }
      else{
        total_Balance[index]=produceItems[index].promo_price
      }
      index++;
    }//end of while loop

    //TODO: AT THIS POINT WE HAVE ALL THE CASE COST AND PROMO COST IN total_Balance ARRAY.
    //TODO: NOW LETS GET THE QUANTITY FOR EACH PRODUCE ITEM.
    getQuantity()
    //TODO:CALCULATE TOTAL
    calculateTotal();

    updateTotalBalance(total)
    return total
  }

  const toggleEdit=(index)=>{
    console.log("editButtonIndex is ",editButtonIndex, "index is ", index)
    let tempValue
    setValue('')
    setValueQty('')
    // setQtyIndex(index !== qtyIndex ? index : null)    
    setEditIndex(index !== editIndex ? index : null)
    setEditButtonIndex(index !== editButtonIndex ? index : null)
    setDeleteButtonIndex(index !== deleteButtonIndex ? index : null)
  }

  const setValueUpdateProduce=()=>{

    console.log("Inside value of setValueUpdateProduce is")
  }


  const setValueUpdateQty=(e,row)=>{
 

    setProduceValue(produceItems[row],row)
    setValueQty(e.target.value)
  }

  const setProduceValue=(newValue, id)=>{
    setValue(newValue);
  }

  const getValue=(indexRow)=>{
    let tempValue


    if(produceItems[indexRow] !==null){
          return produceItems[indexRow]
    }

  }

  const clearProgress=(index)=>{
    setQtyIndex(index !== qtyIndex ? index : null)    
    setEditIndex(index !== editIndex ? index : null)
    setEditButtonIndex(index !== editButtonIndex ? index : null)
    setDeleteButtonIndex(index !== deleteButtonIndex ? index : null)
  }

  const getQtyValue=(index)=>{
    if (produceItems[index] !==null) {
      return produceItems[index].Qty
    }
  }

  const updateData=(index)=>{

    
    //TODO:GET THE PRODUCE NAME FROM THE NEW VALUE
    let updateProduceName = value.name

    //TODO:USING THE INDEX VALUE REPLACE THE CURRENT PRODUCE NAME WITH THE VALUE OF THE NEW NAME
    produceItems[index].name=updateProduceName
    produceItems[index].id=value.id
    produceItems[index].case_cost=value.case_cost
    produceItems[index].inventory=value.inventory
    produceItems[index].promo_price=value.promo_price
    produceItems[index].case_size=value.case_size
    produceItems[index].product_code=value.product_code
    produceItems[index].stock=value.stock
    produceItems[index].Qty=valueQty


    toggleEdit(index)
  
  }

  const deleteRecord=(index)=>{
    let tempID=produceItems[index].id

    // setProduceItems(prevItems=>prevItems.filter(item=>item.id !== tempID))
    updateUserOrder(prevItems=>prevItems.filter(item=>item.id !== tempID))

  }

  const handleDelete = (index) => {
    console.log("index is ", index)
    let tempID=produceItems[index].id

    setProduceItems(prevItems=>prevItems.filter(item=>item.id !== tempID))
    // updateUs(prevItems=>prevItems.filter(item=>item.id !== tempID))
  };

  const submitOrder = async (event) => {
    try {
      // Validate order before sending
      if (!userCurrentOrder || userCurrentOrder.length === 0) {
        setError('Cannot submit empty order');
        toggleSubmitButton();
        return;
      }

      // Transform produceItems to match backend expectation
      const items = userCurrentOrder.map(item => ({
        name: item.name,
        quantity: parseInt(item.Qty), // Ensure quantity is a number
        case_cost: parseFloat(item.promo_price > 0 ? item.promo_price : item.case_cost),
        promo: parseFloat(item.promo_price),
        total: parseFloat(getTotal()) // Use the getTotal function instead of totalBalance
      }));

      console.log('Attempting to send order with data:', { items });

      const response = await axios.post('http://127.0.0.1:8000/api/send-order', { items }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });

      console.log('Server response:', response);

      if (response.data.message === 'Order sent successfully!') {
        console.log('Order submitted successfully');
        setError(null);
        toggleSubmitButton();
        toggleSubmitButtonClicked();
        clearOrder();
        updateCurrentBalance([]);
      } else {
        console.error('Unexpected response:', response.data);
        throw new Error('Unexpected response from server');
      }
      
    } catch (error) {
      console.error('Full error object:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      
      setError(
        error.response?.data?.message || 
        error.message || 
        'Failed to send order. Please try again.'
      );
      toggleSubmitButton();
    }
  };

  const handleClose3=(e,reason)=>{
    console.log(e)
    console.log(reason)

    if (reason==='clickaway') {
      return
    }

    toggleSubmitButton();

  }

  const clearCurrentOrder=()=>{

    total=0.00
 
    clearOrder()
    router.push('/produceorder')
  }

  const mainPage=(e)=>{
 

    console.log(e)
    // total=0.00
    // updateTotalBalance(0.00)
    // clearOrder()
    router.push('/produceorder')
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar title="Confirm Your Order" />
      
      <div className="lg:w-4/12 container mx-auto lg:px-4 lg:py-4 mt-14">
        {/* Order Summary - Moved to top for better visibility */}
        <div className="mb-4 bg-white rounded-lg shadow-sm p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
              <span className="text-gray-600">Total Quantity:</span>
              <span className="text-lg font-semibold">{getTotalQuantity()}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded">
              <span className="text-gray-600">Total Amount:</span>
              <span className="text-lg font-semibold">${parseFloat(getTotal()).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Order Items List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="divide-y divide-gray-100">
            {userCurrentOrder.map((item, index) => (
              <div key={item.id} 
                className={`p-3 hover:bg-gray-50 transition-colors
                  ${item.stock === false ? 'opacity-75 bg-gray-50' : ''}`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0 mr-4">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-medium capitalize truncate">{item.name}</h3>
                      <div className="text-sm">
                        <span className="font-medium">
                          ${item.promo_price === 0 ? item.case_cost : item.promo_price}
                        </span>
                        {item.promo_price > 0 && (
                          <span className="ml-2 text-green-600 text-xs">
                            (Promo: ${item.promo_price})
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      Case Size: {item.case_size}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.Qty < 10 ? (
                      <QuantitySelector 
                        onQuantityChange={handleQuantityChange}
                        removeItem={handleDelete}
                        index={index}
                        id={item.id}
                        produceItems={userCurrentOrder}
                        outStock={item.stock}
                        toggleCustomQty={toggleCustomQty}
                        className="w-28"
                      />
                    ) : (
                      <div className="flex items-center gap-1">
                        <TextField
                          value={quantity.length === 0 ? item.Qty : quantity}
                          onChange={(e) => handleQtyChange(quantity, item.Qty, index, item.id)}
                          size="small"
                          className="w-16"
                          InputProps={{
                            className: "text-center text-sm"
                          }}
                        />
                        {customQty && (
                          <Button 
                            onClick={updateQty}
                            variant="contained"
                            size="small"
                            className="min-w-0 px-2 py-1 bg-yellow-500 hover:bg-yellow-600 text-black"
                          >
                            ✓
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex justify-end gap-3">
          <Button
            variant="outlined"
            onClick={mainPage}
            className="px-4 py-1.5 text-sm text-blue-600 border-blue-600 hover:bg-blue-50"
          >
            Modify Order
          </Button>
          <Button
            variant="contained"
            onClick={submitOrder}
            disabled={submitButton}
            className="px-4 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white"
          >
            Submit Order
          </Button>
        </div>
      </div>

      {/* Success Snackbar */}
      <Snackbar1
        message={error === null ? 'Order Submitted Successfully' : error}
        autoHideDuration={2000}
        open={submitButton}
        onClose={handleClose3}
        sx={{
          '& .MuiSnackbarContent-root': {
            backgroundColor: 'rgb(45, 212, 191)',
            color: 'black',
            fontWeight: 'bold',
            borderRadius: '4px',
            padding: '0.75rem',
          },
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'      
        }}      
      />

      {submitButton && clearCurrentOrder()}
    </div>
  );
};

export default ProduceList;
