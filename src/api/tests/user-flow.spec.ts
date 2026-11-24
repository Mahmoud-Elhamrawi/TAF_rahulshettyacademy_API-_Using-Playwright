import { test, expect } from "@playwright/test";

import { loginTC } from "../endpoint/user-flow";
import { registerTC } from "../endpoint/user-flow";
import { addProductTC } from "../endpoint/user-flow";
import userData from "../test-data/user-data.json";
import { createNewOrderTC } from "../endpoint/user-flow";
import { deleteProductTC } from "../endpoint/user-flow";
import { End2EndFlowTC } from "../endpoint/user-flow";


//Register TC
test("Register TC", async ({ request }) => {
  let { resBody, res } = await registerTC(request, userData.toBeRegister);

  expect(resBody).toBeTruthy();
  expect(res).toBeOK();
  expect(resBody.message).toBe("Registered Successfully");

  expect(resBody).toEqual(
    expect.objectContaining({
      message: expect.any(String),
    }),
  );
});

//login TC
test("login test", async ({ request }) => {
  let { resBody, res } = await loginTC(request, userData.toBeLogin);

  expect(resBody).toBeTruthy();
  await expect(res).toBeOK();
  // asymertic matchers
  expect(resBody).toEqual(
    expect.objectContaining({
      token: expect.anything(),
      userId: expect.any(String),
    }),
  );
});

//Create New Product TC
test("Create New Product TC", async ({ request }) => {
  const { resBodyProduct, resProduct } = await addProductTC(
    request,
    userData.toBeLogin,
    userData.toCreateProduct,
  );

  expect(resBodyProduct).toBeTruthy();
  await expect(resProduct).toBeOK();
  expect(resBodyProduct).toEqual(
    expect.objectContaining({
      message: expect.any(String),
      productId: expect.any(String),
    }),
  );
});

//create new order TC
test("Create New Order TC", async ({ request }) => {
  const { orderbody, resOrder, resOrderDetails, orderDetailsBody } =
    await createNewOrderTC(
      request,
      userData.toBeLogin,
      userData.toCreateProduct,
      userData.toCreateOrder,
    );
  // Create new order  Assertions
  expect(orderbody).toBeTruthy();
  await expect(resOrder).toBeOK();
  expect(orderbody).toEqual(
    expect.objectContaining({
      orders: expect.any(Array),
      productOrderId: expect.anything(),
    }),
  );

  // Get Order Details Assertions
  await expect(resOrderDetails).toBeOK();

  expect(orderDetailsBody).toBeTruthy();
});

//Delete product TC
test("Delete product TC", async ({ request }) => {
  const deleteRes = await deleteProductTC(
    request,
    userData.toBeLogin,
    userData.toCreateProduct,
  );
  expect(deleteRes).toBeTruthy();

  let deleteBody = await deleteRes.json();
  console.log(deleteBody);
  expect(deleteBody.message).toEqual("Product Deleted Successfully");
  await expect(deleteRes).toBeOK();
});

//End 2 end Flow Tc
test("End 2 end Flow Tc", async ({ request }) => {
  const { deleResBody, orderbody, orderDetailsBody, resLoginBody, resBodyProduct,} =
   await End2EndFlowTC(
    request,
    userData.toBeLogin,
    userData.toCreateProduct,
    userData.toCreateOrder,
  );
    expect(deleResBody.message).toEqual("Product Deleted Successfully");
  expect(resLoginBody).toBeTruthy();
  expect(orderDetailsBody).toBeTruthy();
  expect(resBodyProduct).toBeTruthy();
  expect(orderbody).toBeTruthy();
  expect(deleResBody.message).toEqual("Product Deleted Successfully");
});
