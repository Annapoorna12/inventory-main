import axios from "axios"

import ServiceURL from "./constants/url"

 const requestPost = async (data) =>{
  const response = await axios.post(ServiceURL,data)
  return response
}

const requestGet = async (data) => {
    const response = await axios.get(ServiceURL,data)
    return response
}

const requestPut = async (data) => {
    const response = await axios.put(ServiceURL,data)
    return response
}

export {requestGet,requestPost,requestPut} 
