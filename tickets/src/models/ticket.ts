/* 
This file will be responsible for defining the Ticket model. It will define the schema for the Ticket model and export the Ticket model.

1. Define an interface for ticket model attributes. This interface defines the attributes used to create a new ticket.
2. Define an interface for the ticket model document, which extends the mongoose Document interface. This interface defines what properties a ticket document will have.
3. Define an interface for the ticket model, which extends the mongoose Model interface. This interface defines what methods the Ticket model will have.
4. Define the ticket schema using mongoose. This schema defines the structure of the ticket model.
5. Define the Ticket model using mongoose. This model is used to interact with the tickets collection in the database.
*/

import mongoose, { Schema } from "mongoose";
const { Types } = Schema;

// 1. Define an interface for ticket model attributes
interface TicketAttrs {
  title: string;
  price: string;
  userId: string;
}

// 2. Define an interface for the ticket model document
interface TicketDoc extends mongoose.Document {
  title: string;
  price: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// 3. Define an interface for the ticket model
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

// 4. Define the ticket schema
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
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};

// 5. Define the Ticket model
const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };
