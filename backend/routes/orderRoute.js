import express from 'express';

const router = express.Router();

import Order from '../models/orderModel.js';
import { auth } from '../middleware/auth.js';

// Get all Orders
// GET @/api/orders
// Private
router.get('/', auth, (req, res) => {
   Order.find()
      .sort({ createdAt: -1 })
      .then((order) => res.status(200).json(order))
      .catch(() => res.status(400).json({ msg: 'An error occured!' }));
});

// Get a single Order
// GET @/api/orders/:id
// Private
router.get('/:id', auth, (req, res) => {
   Order.findById(req.params.id)
      .then((order) => {
         if (!order)
            return res.status(404).json({ msg: 'Order does not exist!' });

         res.status(200).json(order);
      })
      .catch(() => res.status(400).json({ msg: 'An error occured!' }));
});

// Create an Order
// POST @/api/orders/
// Private
router.post('/', auth, (req, res) => {
   const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemPrice,
      shippingPrice,
      totalPrice,
      user,
      userObj,
   } = req.body;

   if (orderItems.length === 0) {
      res.status(400).json({ msg: 'Cart is empty!' });
   } else {
      const newOrder = new Order({
         orderItems,
         shippingAddress,
         paymentMethod,
         itemPrice,
         shippingPrice,
         totalPrice,
         user,
         userObj,
      });

      newOrder
         .save()
         .then((order) => res.status(201).json(order))
         .catch(() =>
            res
               .status(400)
               .json({ msg: 'Order not created! An error occured!' })
         );
   }
});

// Get all my orders list
// GET @/api/orders/myorders/mine
// Private
router.get('/myorders/mine', auth, (req, res) => {
   Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .then((order) => res.status(200).json(order))
      .catch(() => res.status(400).json({ msg: 'An error occured!' }));
});

// Get all my orders list recent
// GET @/api/orders/myorders/mine/recent
// Private
router.get('/myorders/mine/recent', auth, (req, res) => {
   Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(2)
      .then((order) => res.status(200).json(order))
      .catch(() => res.status(400).json({ msg: 'An error occured!' }));
});

export default router;