import Order from "../../domain/entity/order";
import OrderItem from "../../domain/entity/order_item";
import OrderRepositoryInterface from "../../domain/repository/order-repository.interface";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderModel from "../db/sequelize/model/order.model";

export default class OrderRepository implements OrderRepositoryInterface{
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {

    await OrderItemModel.destroy({
      where: { order_id: entity.id },
    });

    await OrderItemModel.bulkCreate(
      entity.items.map((item) => ({
        id: item.id,
        order_id: entity.id,
        name: item.name,
        price: item.price,
        product_id: item.productId,
        quantity: item.quantity,
      }))
    );

    await OrderModel.update(
      {
        total: entity.total()
      },
      {
        where: { 
          id: entity.id
        }
      }
    );
  }
  
  async find(id: string): Promise<Order> {
    let orderModel;
    try {
      orderModel = await OrderModel.findOne({
        where: {
          id,
        },
        rejectOnEmpty: true,
        include: ["items"],
        order: [
          ['items', 'id', 'asc']
        ]
      });
    } catch (error) {
      throw new Error("Order not found");
    }

    const order = new Order(orderModel.id, orderModel.customer_id, 
      orderModel.items.map((item)=>(new OrderItem(
        item.id,
        item.name,
        item.price,
        item.product_id,
        item.quantity       
      )))
      );

    return order;
  }

  async findAll(): Promise<Order[]> {
    const orderModels = await OrderModel.findAll({
      include: ["items"]
      ,
      order: [
        ['id', 'asc'],
        ['items', 'id', 'asc']
      ]
    });

    const orders = orderModels.map((order) =>{
      const orderItems = order.items.map((item)=>(new OrderItem(
        item.id,
        item.name,
        item.price,
        item.product_id,
        item.quantity       
      )));
      return new Order(order.id, order.customer_id, orderItems);
    });
      
    return orders;
  }
}
