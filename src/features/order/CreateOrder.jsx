// import { useState } from "react";
import { Form, redirect } from "react-router-dom";
import { createOrder } from "../../services/apiRestaurant";

// https://uibakery.io/regex-library/phone-number
// const isValidPhone = (str) =>
//   /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
//     str
//   );

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

  return (
    <div>
      <h2>Ready to order? Lets go!</h2>

      {/* NOTE - both ways are correct (in form tag) */}
      {/* <Form method="POST" action="order/new"> */}
      <Form method="POST">
        <div>
          <label>First Name</label>
          <input type="text" name="customer" required />
        </div>

        <div>
          <label>Phone number</label>
          <div>
            <input type="tel" name="phone" required />
          </div>
        </div>

        <div>
          <label>Address</label>
          <div>
            <input type="text" name="address" required />
          </div>
        </div>

        <div>
          <input
            type="checkbox"
            name="priority"
            id="priority"
            // value={withPriority}
            // onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority">Want to yo give your order priority?</label>
        </div>

        <div>
          <button className="font-semibold rounded-full tracking-wide bg-yellow-400 hover:bg-yellow-300 transition-colors duration-300 focus:bg-yellow-300 focus:outline-none focus:ring focus:ring-yellow-300 focus:ring-offset-2 uppercase text-stone-800 py-3 px-4 disabled:cursor-not-allowed">Order now</button>
        </div>

        <input type="hidden" name="cart" value={JSON.stringify(cart)}/>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  //REVIEW - formData is a web API provided by the browser 
  const formData = await request.formData()
  const data = Object.fromEntries(formData)
  // console.log(data)

  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === "on",
  }
  console.log(order)

  const newOrder = await createOrder(order)
  console.log(newOrder)

  return redirect(`/order/${newOrder.id}`)
}

export default CreateOrder;