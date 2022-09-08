import { Sequelize } from "sequelize-typescript";
import Address from "../../domain/entity/address";
import Customer from "../../domain/entity/customer";
import OrderItem from "../../domain/entity/order_item";
import Product from "../../domain/entity/product";
import CustomerModel from "../db/sequelize/model/customer.model";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderModel from "../db/sequelize/model/order.model";
import ProductModel from "../db/sequelize/model/product.model";
import CustomerRepository from "./customer.repository";
import ProductRepository from "./product.repository";
import Order from "../../domain/entity/order";
import OrderRepository from "./order.repository";
import { v4 as uuid } from "uuid";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const ordemItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("123", "123", [ordemItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: ordemItem.id,
          name: ordemItem.name,
          price: ordemItem.price,
          quantity: ordemItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });

  it("should update an order", async ()=>{
    const customerRepository = new CustomerRepository();
    const customer = new Customer(uuid(), "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product(uuid(), "Product 1", 10);
    await productRepository.create(product);
    const product2 = new Product(uuid(), "Product 2", 20);
    await productRepository.create(product2);
    const product3 = new Product(uuid(), "Product 3", 5);
    await productRepository.create(product3);

    const ordemItem1 = new OrderItem(uuid(), product.name, product.price, product.id, 2);
    const ordemItem2 = new OrderItem(uuid(), product2.name, product2.price, product2.id, 1);
    const order = new Order(uuid(), customer.id, [ordemItem1, ordemItem2].sort((a, b)=>sortId(a.id, b.id)));

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const ordemItemU1 = new OrderItem(uuid(), product.name, product.price, product.id, 3);
    const ordemItemU2 = new OrderItem(uuid(), product3.name, product3.price, product3.id, 1);
    order.changeItems([ordemItemU1, ordemItemU2].sort((a, b)=>sortId(a.id, b.id)));
    await orderRepository.update(order);

    const orderResult = await orderRepository.find(order.id);
    expect(order).toStrictEqual(orderResult);
  });

  it("should find an order", async ()=>{
    const customerRepository = new CustomerRepository();
    const customer = new Customer(uuid(), "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product(uuid(), "Product 1", 10);
    await productRepository.create(product);

    const ordemItem = new OrderItem(uuid(), product.name, product.price, product.id, 2);
    const order = new Order(uuid(), customer.id, [ordemItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderResult = await orderRepository.find(order.id);
    expect(order).toStrictEqual(orderResult);
    
  });

  it("should throw an error when order is not found", async ()=>{
    const orderRepository = new OrderRepository();
    expect(async () => {
      await orderRepository.find("aaaaaaaa");
    }).rejects.toThrow("Order not found");
  });

  it("should find all orders", async ()=>{
    const customerRepository = new CustomerRepository();
    const customer = new Customer(uuid(), "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product(uuid(), "Product 1", 10);
    const product2 = new Product(uuid(), "Product 2", 5);
    await productRepository.create(product);
    await productRepository.create(product2);

    const orderRepository = new OrderRepository();
    const ordemItemA1 = new OrderItem(uuid(), product.name, product.price, product.id, 2);
    const orderA = new Order(uuid(), customer.id, [ordemItemA1]);    
    await orderRepository.create(orderA);

    const ordemItemB1 = new OrderItem(uuid(), product.name, product.price, product.id, 3);
    const ordemItemB2 = new OrderItem(uuid(), product2.name, product2.price, product2.id, 1);
    const orderB = new Order(uuid(), customer.id, [ordemItemB1, ordemItemB2].sort((a, b)=>sortId(a.id, b.id)));
    await orderRepository.create(orderB);

    const orders = [orderA, orderB].sort((a, b)=>sortId(a.id, b.id));

    const orderResult = await orderRepository.findAll();  
    expect(orders).toStrictEqual(orderResult);
  });

  function sortId(x: string, y: string){
    return x < y ? -1 : x > y ? 1 : 0;
  }

});


