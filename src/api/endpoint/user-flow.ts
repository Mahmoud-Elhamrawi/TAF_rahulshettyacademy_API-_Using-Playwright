import { APIRequestContext } from "@playwright/test";
import { readFileSync } from "node:fs";
import path from "node:path";

const PATH_PARAM = "/api/ecom/auth";
const lOGIN_ENDPOINT = "/login";
const REGISTER_ENDPOINT = "/register";

const PATH_PARAM1 = "/api/ecom/product";
const ADD_PRODUCT_ENDPOINT = "/add-product";

const PATH_PARAM2 = "/api/ecom/order";
const ADD_ORDER_ENDPOINT = "/create-order";

//Register TC
async function registerTC(req: APIRequestContext, userData: any) {
  let res = await req.post(PATH_PARAM + REGISTER_ENDPOINT, {
    headers: {
      "Content-Type": "application/json",
    },
    data: userData,
  });
  let resBody = await res.json();
  console.log(resBody);
  return { resBody, res };
}

//login TC
async function loginTC(req: APIRequestContext, userData: any) {
  let res = await req.post(PATH_PARAM + lOGIN_ENDPOINT, {
    headers: {
      "Content-Type": "application/json",
    },
    data: userData,
  });
  let resBody = await res.json();
  console.log(resBody);
  return { resBody, res };
}

//add product TC
async function addProductTC(
  req: APIRequestContext,
  userDataLogin: any,
  userDataProduct: any,
) {
  //Login
  let resLogin = await req.post(PATH_PARAM + lOGIN_ENDPOINT, {
    headers: {
      "Content-Type": "application/json",
    },
    data: userDataLogin,
  });
  let resBodyLogin = await resLogin.json();
  let tokenLogin = resBodyLogin.token;
  let userID = resBodyLogin.userId;

  // Merge JSON data with dynamic userID
  const productData = {
    ...userDataProduct,
    productAddedBy: userID,
  };

  // Read image from JSON path
  const imagePath = path.resolve(process.cwd(), userDataProduct.productImage);

  const imageBuffer = readFileSync(imagePath);

  let resProduct = await req.post(PATH_PARAM1 + ADD_PRODUCT_ENDPOINT, {
    headers: { Authorization: tokenLogin },
    multipart: {
      ...productData,
      productImage: {
        name: path.basename(imagePath),
        mimeType: "image/jpeg",
        buffer: imageBuffer,
      },
    },
  });
  let resBodyProduct = await resProduct.json();
  console.log(resBodyProduct);

  return { resBodyProduct, resProduct };
}

//add order TC
async function createNewOrderTC(
  req: APIRequestContext,
  userDataLogin: any,
  userDataProduct: any,
  orderData: any,
) {
  //Login
  let resLogin = await req.post(PATH_PARAM + lOGIN_ENDPOINT, {
    headers: {
      "Content-Type": "application/json",
    },
    data: userDataLogin,
  });
  let resBodyLogin = await resLogin.json();
  let tokenLogin = resBodyLogin.token;
  let userID = resBodyLogin.userId;

  // Merge JSON data with dynamic userID
  const productData = {
    ...userDataProduct,
    productAddedBy: userID,
  };

  // Read image from JSON path
  const imagePath = path.resolve(process.cwd(), userDataProduct.productImage);

  const imageBuffer = readFileSync(imagePath);

  let resProduct = await req.post(PATH_PARAM1 + ADD_PRODUCT_ENDPOINT, {
    headers: { Authorization: tokenLogin },
    multipart: {
      ...productData,
      productImage: {
        name: path.basename(imagePath),
        mimeType: "image/jpeg",
        buffer: imageBuffer,
      },
    },
  });
  let resBodyProduct = await resProduct.json();
  console.log(resBodyProduct);

  //create order
  let prodID = resBodyProduct.productId;
  // Merge JSON data with dynamic userID
  const ordertData = {
    ...orderData,
    orders: orderData.orders.map((order: any) => ({
      ...order,
      productOrderedId: prodID,
    })),
  };

  const resOrder = await req.post(PATH_PARAM2 + ADD_ORDER_ENDPOINT, {
    headers: { Authorization: tokenLogin },
    data: ordertData,
  });

  let orderbody = await resOrder.json();
  console.log(orderbody);

  let orderID = orderbody.orders[0];
  console.log(orderID);
  // Get Order Details
  const resOrderDetails = await req.get("/api/ecom/order/get-orders-details", {
    headers: { Authorization: tokenLogin },
    params: { id: orderID },
  });

  const orderDetailsBody = await resOrderDetails.json();

  console.log("Order Details:", orderDetailsBody);

  return { orderbody, resOrder, resOrderDetails, orderDetailsBody };
}


//Delete Product
async function deleteProductTC(req:APIRequestContext ,  userDataLogin: any,  userDataProduct: any,){
    //Login
  let resLogin = await req.post(PATH_PARAM + lOGIN_ENDPOINT, {
    headers: {
      "Content-Type": "application/json",
    },
    data: userDataLogin,
  });
  let resBodyLogin = await resLogin.json();
  let tokenLogin = resBodyLogin.token;
  let userID = resBodyLogin.userId;


  // Merge JSON data with dynamic userID
  const productData = {
    ...userDataProduct,
    productAddedBy: userID,
  };

  // Read image from JSON path
  const imagePath = path.resolve(process.cwd(), userDataProduct.productImage);

  const imageBuffer = readFileSync(imagePath);

  let resProduct = await req.post(PATH_PARAM1 + ADD_PRODUCT_ENDPOINT, {
    headers: { Authorization: tokenLogin },
    multipart: {
      ...productData,
      productImage: {
        name: path.basename(imagePath),
        mimeType: "image/jpeg",
        buffer: imageBuffer,
      },
    },
  });
  let resBodyProduct = await resProduct.json();
  let prodID = resBodyProduct.productId;
  console.log(resBodyProduct);



  //delete
  let deleRes =  await req.delete(`/api/ecom/product/delete-product/${prodID}`, {
    headers: { Authorization: tokenLogin },
   })

   return deleRes ;
}



async function End2EndFlowTC(req: APIRequestContext,userDataLogin: any,userDataProduct: any, orderData: any,){
//Login
  let resLogin = await req.post(PATH_PARAM + lOGIN_ENDPOINT, {
    headers: {
      "Content-Type": "application/json",
    },
    data: userDataLogin,
  });
  let resBodyLogin = await resLogin.json();
  let tokenLogin = resBodyLogin.token;
  let userID = resBodyLogin.userId;
  const resLoginBody = await resLogin.json()
console.log(resLoginBody);

  // Merge JSON data with dynamic userID
  const productData = {
    ...userDataProduct,
    productAddedBy: userID,
  };

  // Read image from JSON path
  const imagePath = path.resolve(process.cwd(), userDataProduct.productImage);

  const imageBuffer = readFileSync(imagePath);

  // Create Product
  let resProduct = await req.post(PATH_PARAM1 + ADD_PRODUCT_ENDPOINT, {
    headers: { Authorization: tokenLogin },
    multipart: {
      ...productData,
      productImage: {
        name: path.basename(imagePath),
        mimeType: "image/jpeg",
        buffer: imageBuffer,
      },
    },
  });
  let resBodyProduct = await resProduct.json();
  console.log(resBodyProduct);

  //create order
  let prodID = resBodyProduct.productId;
  // Merge JSON data with dynamic userID
  const ordertData = {
    ...orderData,
    orders: orderData.orders.map((order: any) => ({
      ...order,
      productOrderedId: prodID,
    })),
  };

  const resOrder = await req.post(PATH_PARAM2 + ADD_ORDER_ENDPOINT, {
    headers: { Authorization: tokenLogin },
    data: ordertData,
  });

  let orderbody = await resOrder.json();
  console.log(orderbody);

  let orderID = orderbody.orders[0];
  console.log(orderID);

  // Get Order Details
  const resOrderDetails = await req.get("/api/ecom/order/get-orders-details", {
    headers: { Authorization: tokenLogin },
    params: { id: orderID },
  });

  const orderDetailsBody = await resOrderDetails.json();

  console.log("Order Details:", orderDetailsBody);

  
//delete
    let deleRes =  await req.delete(`/api/ecom/product/delete-product/${prodID}`, {
    headers: { Authorization: tokenLogin },
   })
  const deleResBody = await deleRes.json();
console.log(deleResBody);
   return { deleResBody, orderbody, orderDetailsBody ,resLoginBody  ,resBodyProduct} ;

}



export { loginTC, registerTC, addProductTC, createNewOrderTC ,deleteProductTC ,End2EndFlowTC};
