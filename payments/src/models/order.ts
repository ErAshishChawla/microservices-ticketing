import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { OrderStatus } from "@eractickets/ticketing-common";

// 1. Create an interface representing the properties required to create a new Order
interface OrderAttrs {
  id: string;
  version: number;
  status: OrderStatus;
  userId: string;
  price: string;
}

// 2. Create an interface representing the properties that a Order Document has
interface OrderDoc extends mongoose.Document {
  id: string;
  status: OrderStatus;
  userId: string;
  price: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

// 3. Create an interface representing the properties that a Order Model has
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
  findByEvent(event: { id: string; version: number }): Promise<OrderDoc | null>;
}

// 4. Define the schema
const orderSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
    },
    userId: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Order.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

// 5. Define the build method
orderSchema.statics.build = ({ id, ...rest }: OrderAttrs) => {
  return new Order({
    _id: id,
    ...rest,
  });
};

// 6. Create the model
export const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);
