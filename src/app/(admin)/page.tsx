
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useMemo } from 'react';
import { recentOrders, type Order } from '@/lib/data';

const salesData = [
  { name: "Jan", sales: 4000 },
  { name: "Feb", sales: 3000 },
  { name: "Mar", sales: 5000 },
  { name: "Apr", sales: 4500 },
  { name: "May", sales: 6000 },
  { name: "Jun", sales: 5500 },
];

export default function AdminDashboardPage() {

   const { totalRevenue, totalSales, newCustomers } = useMemo(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const relevantOrders = recentOrders.filter(o => new Date(o.date) >= sevenDaysAgo && o.status === 'Delivered');
    
    const totalRevenue = relevantOrders.reduce((acc, order) => acc + parseFloat(order.amount), 0);
    const totalSales = relevantOrders.length;

    const customerSet = new Set(relevantOrders.map(o => o.customer));
    const newCustomers = customerSet.size;

    return { totalRevenue, totalSales, newCustomers };
  }, []);

  const recentOrderSlice = useMemo(() => {
    return [...recentOrders]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, []);

  const salesByDay = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return {
        name: d.toLocaleDateString('en-US', { short: 'weekday' }),
        Sales: 0,
      };
    }).reverse();

    recentOrders.forEach(order => {
        if (order.status === 'Delivered') {
            const orderDate = new Date(order.date);
            const today = new Date();
            const diffTime = Math.abs(today.getTime() - orderDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays <= 7) {
                const dayName = orderDate.toLocaleDateString('en-US', { short: 'weekday' });
                const day = days.find(d => d.name === dayName);
                if (day) {
                    day.Sales += parseFloat(order.amount);
                }
            }
        }
    });

    return days;
  }, []);


  return (
    <>
      <main className="flex-1 overflow-y-auto p-6">
        <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <span className="text-sm text-muted-foreground">Last 7 Days</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">BDT {totalRevenue.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Sales</CardTitle>
               <span className="text-sm text-muted-foreground">Last 7 Days</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{totalSales}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">New Customers</CardTitle>
               <span className="text-sm text-muted-foreground">Last 7 Days</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{newCustomers}</div>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-6 mt-6 md:grid-cols-5">
            <Card className="md:col-span-3">
                <CardHeader>
                    <CardTitle>Sales Overview</CardTitle>
                    <CardDescription>Sales performance over the last 7 days.</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                   <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={salesByDay}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `BDT ${value/1000}k`} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "hsl(var(--background))",
                                border: "1px solid hsl(var(--border))",
                            }}
                        />
                        <Line type="monotone" dataKey="Sales" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4, fill: "hsl(var(--primary))" }} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            <Card className="md:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Recent Orders</CardTitle>
                    <Button asChild variant="ghost" size="sm" className="text-sm">
                        <Link href="/admin/orders">
                            View All <ArrowUpRight className="h-4 w-4 ml-1" />
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                   <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Customer</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentOrderSlice.map(order => (
                                <TableRow key={order.id}>
                                    <TableCell>
                                        <div className="font-medium">{order.customer}</div>
                                        <div className="text-xs text-muted-foreground">{order.date}</div>
                                    </TableCell>
                                    <TableCell className="text-right font-medium">BDT {parseInt(order.amount).toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                   </Table>
                </CardContent>
            </Card>
        </div>
      </main>
    </>
  );
}
