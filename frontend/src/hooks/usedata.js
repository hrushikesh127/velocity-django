import { useQuery } from '@tanstack/react-query'
import React from 'react'
import apiclient from '../utils/apiclient'

function Usedata(endpoints) {
  const fetchcars =() =>  apiclient.get(endpoints).then(res=>res.data);
  return useQuery({
    queryKey:['/cars' , endpoints],
    queryFn:fetchcars
  })
}

export default Usedata
