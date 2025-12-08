
'use client';

import { useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { recentOrders, type Order } from '@/lib/data';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type Customer = {
  name: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
};

type CustomerWithOrders = Customer & {
    orders: Order[];
}

export default function AdminCustomersPage() {
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerWithOrders | null>(null);

  const customers = useMemo(() => {
    const customerMap = new Map<string, CustomerWithOrders>();

    recentOrders.forEach((order) => {
      const customerKey = `${order.customer}-${order.phone}`;
      const existingCustomer = customerMap.get(customerKey);

      if (existingCustomer) {
        existingCustomer.totalOrders += 1;
        existingCustomer.totalSpent += parseFloat(order.amount);
        existingCustomer.orders.push(order);
      } else {
        customerMap.set(customerKey, {
          name: order.customer,
          phone: order.phone,
          totalOrders: 1,
          totalSpent: parseFloat(order.amount),
          orders: [order],
        });
      }
    });

    return Array.from(customerMap.values()).sort(
      (a, b) => b.totalSpent - a.totalSpent
    );
  }, []);

  const handleViewDetails = (customer: CustomerWithOrders) => {
    setSelectedCustomer(customer);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Customers</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Customer Management</CardTitle>
          <CardDescription>
            View and manage your customer data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative w-full overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead className="text-center">Orders</TableHead>
                  <TableHead className="text-right">Total Spent</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={`${customer.name}-${customer.phone}`}>
                    <TableCell>
                      <div className="font-medium">{customer.name}</div>
                    </TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell className="text-center">
                      {customer.totalOrders}
                    </TableCell>
                    <TableCell className="text-right">
                      BDT {customer.totalSpent.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleViewDetails(customer)}>
                            View Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Customer Details Dialog */}
       <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
          <DialogContent className="sm:max-w-3xl">
              {selectedCustomer && (
                  <>
                      <DialogHeader>
                          <DialogTitle>Order History for {selectedCustomer.name}</DialogTitle>
                          <DialogDescription>
                              Showing all orders placed by this customer.
                          </DialogDescription>
                      </DialogHeader>
                      <div className="py-4 max-h-[60vh] overflow-y-auto">
                          <Table>
                              <TableHeader>
                                  <TableRow>
                                      <TableHead>Order ID</TableHead>
                                      <TableHead>Date</TableHead>
                                      <TableHead>Status</TableHead>
                                      <TableHead className="text-right">Amount</TableHead>
                                  </TableRow>
                              </TableHeader>
                              <TableBody>
                                  {selectedCustomer.orders.map(order => (
                                      <TableRow key={order.id}>
                                          <TableCell className="font-medium">{order.id}</TableCell>
                                          <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                                          <TableCell>
                                              <Badge
                                                  variant={
                                                    order.status === 'Delivered' ? 'default'
                                                    : order.status === 'Cancelled' ? 'destructive'
                                                    : 'secondary'
                                                  }
                                              >
                                                  {order.status}
                                              </Badge>
                                          </TableCell>
                                          <TableCell className="text-right">BDT {parseInt(order.amount).toLocaleString()}</TableCell>
                                      </TableRow>
                                  ))}
                              </TableBody>
                          </Table>
                      </div>
                      <DialogFooter>
                          <Button variant="outline" onClick={() => setSelectedCustomer(null)}>Close</Button>
                      </DialogFooter>
                  </>
              )}
          </DialogContent>
      </Dialog>
    </div>
  );
}
