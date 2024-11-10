import mongoose, { Schema } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

import { Order, OrderStatus } from "./order";

const { Types } = Schema;

// 1. Define interface required to build a new ticket
interface TicketAttrs {
  id: string;
  title: string;
  price: string;
  userId: string;
}

// 2. Define interface for properties a Ticket document has
export interface TicketDoc extends mongoose.Document {
  title: string;
  price: string;
  isReserved(): Promise<boolean>;
  createdAt: string;
  updatedAt: string;
  version: number;
}

// 3. Define interface for Ticket Model
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<TicketDoc | null>;
}

const ticketSchema = new Schema(
  {
    title: {
      type: Types.String,
      required: true,
    },
    price: {
      type: Types.String,
      required: true,
    },
    userId: {
      type: Types.String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
    timestamps: true,
  }
);

ticketSchema.set("versionKey", "version");
// ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.pre("save", function (done) {
  this.$where = {
    version: this.get("version") - 1,
  };

  done();
});

ticketSchema.statics.build = ({ id, ...rest }: TicketAttrs) => {
  return new Ticket({
    _id: id,
    ...rest,
  });
};

ticketSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $ne: OrderStatus.Cancelled,
    },
  });

  return !!existingOrder;
};

ticketSchema.statics.findByEvent = async (event: {
  id: string;
  version: number;
}) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

export const Ticket = mongoose.model<TicketDoc, TicketModel>(
  "Ticket",
  ticketSchema
);
