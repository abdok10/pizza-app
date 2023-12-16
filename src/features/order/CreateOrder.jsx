// import { useState } from "react";
import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { createOrder } from "../../services/apiRestaurant";
import EmptyCart from "../cart/EmptyCart"
import Button from "../../ui/Button";
import { useSelector, useDispatch } from "react-redux";
import { clearCart, getCart, getTotalCartPrice } from "../cart/cartSlice";
import store from '../../store';
import { formatCurrency } from "../../utils/helpers";
import { useState } from "react";
import { fetchAddress } from '../user/userSlice'

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str
  );

// const fakeCart = [
//   {
//     pizzaId: 12,
//     name: "Mediterranean",
//     quantity: 2,
//     unitPrice: 16,
//     totalPrice: 32,
//   },
//   {
//     pizzaId: 6,
//     name: "Vegetale",
//     quantity: 1,
//     unitPrice: 13,
//     totalPrice: 13,
//   },
//   {
//     pizzaId: 11,
//     name: "Spinach and Mushroom",
//     quantity: 1,
//     unitPrice: 15,
//     totalPrice: 15,
//   },
// ];

function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false);
  // console.log(withPriority)

  const { 
    username, 
    status: addressStatus, 
    position, 
    address,
    error: errorAddress,
  } = useSelector(store => store.user);
  const isLoadingAddress = addressStatus === 'loading';

  const cart = useSelector(getCart);
  const totalCartPrice = useSelector(getTotalCartPrice);
  const priorityPrice = withPriority ? totalCartPrice * (20/100) : 0;
  const totalPrice = totalCartPrice + priorityPrice;

  const dispatch = useDispatch();
  const navigation = useNavigation()
  const  isSubmitting = navigation.state === "submitting";
  // console.log(isSubmitting)

  const formErrors = useActionData();
  // console.log(formErrors)

  if (!cart.length) return <EmptyCart />

  return (
    <div className="px-4 py-6">
      <h2 className="text-xl font-semibold mb-8">Ready to order? Lets go!</h2>

      {/* NOTE - both ways are correct (in form tag) */}
      {/* <Form method="POST" action="order/new"> */}
      <Form method="POST">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:justify-between   sm:items-center">
          <label className="sm:basis-40">First Name</label>
          <input type="text" name="customer" required className="input grow" defaultValue={username}/>
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
          <label className="sm:basis-40">Phone number</label>
          <div className="grow">
            <input type="tel" name="phone" required className="input w-full"/>
            {formErrors?.phone && <p className="mt-2 p-2 rounded-md text-xs bg-red-100 text-red-700 p">{formErrors.phone}</p>}
          </div>
        </div>

        <div className="relative mb-5 flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
          <label className="sm:basis-40">Address</label>
          <div className="grow">
            <input 
              type="text" 
              defaultValue={address} 
              name="address" 
              required 
              className="input w-full"
              disabled={isLoadingAddress}
            />
            {addressStatus === 'error' && 
              <p className="mt-2 p-2 rounded-md text-xs bg-red-100 text-red-700 p">
                {errorAddress}
              </p>
            }
          </div>
          {!position.latitude && !position.longitude &&
            <span className="absolute right-[3px] top-[4px] z-20 md:right-[5px] md:top-[5px]">
              <Button 
                disabled={isLoadingAddress}
                type="small"
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(fetchAddress())
                }}
                >
                Get Position
              </Button>
            </span>
          }
        </div>

        <div className="mb-12 flex gap-5 items-center">
          <input
            type="checkbox"
            name="priority"
            id="priority"
            className="h-5 w-5 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label className="font-medium" htmlFor="priority">Want to yo give your order priority?</label>
        </div>

        <div>
          <Button type="primary" disabled={isSubmitting || isLoadingAddress}>
            {isSubmitting ? "Placing Order..." : `Order now from ${formatCurrency(totalPrice)}`}
          </Button>
        </div>

        {/*REVIEW - in order the send the cart to the action */}
        <input type="hidden" name="cart" value={JSON.stringify(cart)}/>
        <input type="hidden" name="position" value={
          position.longitude && position.latitude 
            ? `lat: ${position.latitude}, long: ${position.longitude}`
            : ''
          }
        />
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
    priority: data.priority === "true",
  }
  console.log(order)

  const errors = {};
  if ( !isValidPhone(order.phone) ) 
    errors.phone = "*Please give us your correct phone number. We might need it to call you.";
  
  if (Object.keys(errors).length > 0) return errors;

  //NOTE - If everything is Okay, create new order and redirect.
  const newOrder = await createOrder(order)
  console.log(newOrder)

  //REVIEW - Do Not Overuse this hack (performance prob)
  store.dispatch(clearCart);

  return redirect(`/order/${newOrder.id}`)
}

export default CreateOrder;
