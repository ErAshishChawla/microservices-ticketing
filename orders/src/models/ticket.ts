import mongoose, { Schema } from "mongoose";

const { Types } = Schema;

// 1. Define interface required to build a new ticket
interface TicketAttrs {
  title: string;
  price: string;
  userId: string;
}

// 2. Define interface for properties a Ticket document has
export interface TicketDoc extends mongoose.Document {
  title: string;
  price: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// 3. Define interface for Ticket Model
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
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

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);
