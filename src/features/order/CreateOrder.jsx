// import { useState } from "react";
import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { createOrder } from "../../services/apiRestaurant";
import Button from "../../ui/Button";

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str
  );

const fakeCart = [
  {
    pizzaId: 12,
    name: "Mediterranean",
    quantity: 2,
    unitPrice: 16,
    totalPrice: 32,
  },
  {
    pizzaId: 6,
    name: "Vegetale",
    quantity: 1,
    unitPrice: 13,
    totalPrice: 13,
  },
  {
    pizzaId: 11,
    name: "Spinach and Mushroom",
    quantity: 1,
    unitPrice: 15,
    totalPrice: 15,
  },
];

function CreateOrder() {
  // const [withPriority, setWithPriority] = useState(false);
  const cart = fakeCart;

  const navigation = useNavigation()
  const  isSubmitting = navigation.state === "submitting";
  // console.log(isSubmitting)

  const formErrors = useActionData();
  console.log(formErrors)

  return (
    <div className="px-4 py-6">
      <h2 className="text-xl font-semibold mb-8">Ready to order? Lets go!</h2>

      {/* NOTE - both ways are correct (in form tag) */}
      {/* <Form method="POST" action="order/new"> */}
      <Form method="POST">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:justify-between   sm:items-center">
          <label className="sm:basis-40">First Name</label>
          <input type="text" name="customer" required className="input grow"/>
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
          <label className="sm:basis-40">Phone number</label>
          <div className="grow">
            <input type="tel" name="phone" required className="input w-full"/>
            {formErrors?.phone && <p className="mt-2 p-2 rounded-md text-xs bg-red-100 text-red-700 p">{formErrors.phone}</p>}
          </div>
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
          <label className="sm:basis-40">Address</label>
          <div className="grow">
            <input type="text" name="address" required className="input w-full"/>
          </div>
        </div>

        <div className="mb-12 flex gap-5 items-center">
          <input
            type="checkbox"
            name="priority"
            id="priority"
            className="h-5 w-5 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
            // value={withPriority}
            // onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label className="font-medium" htmlFor="priority">Want to yo give your order priority?</label>
        </div>

        <div>
          <Button type="primary" disabled={isSubmitting}>
            {isSubmitting ? "Placing Order..." : "Order now"}
          </Button>
        </div>

        {/*REVIEW - in order the send the cart to the action */}
        <input type="hidden" name="cart" value={JSON.stringify(cart)}/>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  //REVIEW - formData is a web API provided by the browser 
  const formData = await request.formData()
  const data = Object.fromEntries(formData)
  console.log(data)

  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === "on",
  }
  console.log(order)

  const errors = {};
  if ( !isValidPhone(order.phone) ) 
    errors.phone = "*Please give us your correct phone number. We might need it to call you.";
  
  if (Object.keys(errors).length > 0) return errors;

  //NOTE - If everything is Okay, create new order and redirect.
  const newOrder = await createOrder(order)
  console.log(newOrder)

  return redirect(`/order/${newOrder.id}`)
}

export default CreateOrder;
