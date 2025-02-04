// pages/produce-list.js
import React, {useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSwitch } from '@nextui-org/react';
import { Stack, Autocomplete, TextField, Button, MenuItem, Select } from "@mui/material"
import Snackbar1 from '@mui/material/Snackbar';
import axios from 'axios';
import { useProduce } from '@/pages/context/ProduceContext';
import Link from 'next/link';
import MuiLink from '@mui/material/Link';

const Navbar = ({title, main}) => {
  const {produceListItems, updateProduceList, userCurrentOrder, updateUserOrder, updateTotalBalance, totalBalance,updateQtyTotal,qtyTotal, getQty, clearOrder} = useProduce();
  const [isClient, setIsClient] = useState(false);

    // console.log("title is ",title)
  const router = useRouter();

 useEffect(() => {
    setIsClient(true); // Only set this on the client side
  }, []);

  const handleMainClick=(e)=>{
    e.preventDefault()
    updateTotalBalance(0)
    clearOrder();
    router.push('/produceorder')
  }

  if (!isClient) {
    return null; // Render nothing on the server-side to avoid mismatch
  }
  
  return (
    <div className="w-full fixed top-0 left-0 right-0 z-50">
      <div className="grid grid-rows-1 mb-4 grid-cols-3 p-3 bg-gradient-to-r from-emerald-600 to-lime-500">
        <div></div>
        <div className='flex justify-center'>
          <h1 className='lg:text-2xl font-bold font-sans tracking-wide text-white sm:text-base'>{title}</h1>
        </div>
        <div className='flex justify-end'>
          <Link href="/produceorder">
            <MuiLink 
              onClick={handleMainClick} 
              className='text-white hover:text-emerald-100 text-lg font-medium no-underline transition-colors'>
              {main}
            </MuiLink>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
