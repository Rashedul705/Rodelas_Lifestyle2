
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { bangladeshDistricts } from '@/lib/data';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

type ShippingRule = {
  id: string;
  district: string;
  charge: number;
};

const initialShippingRules: ShippingRule[] = [
    { id: 'rajshahi', district: 'Rajshahi', charge: 60 },
    { id: 'default', district: 'Rest of Bangladesh', charge: 120 },
];

export default function AdminShippingPage() {
  const { toast } = useToast();
  const [rules, setRules] = useState<ShippingRule[]>(initialShippingRules);
  const [isNewRuleDialogOpen, setIsNewRuleDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<ShippingRule | null>(null);
  
  const [newRule, setNewRule] = useState<{ district: string; charge: string }>({ district: '', charge: '' });

  const handleAddRule = () => {
    const charge = parseInt(newRule.charge);
    if (!newRule.district || isNaN(charge) || charge < 0) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select a district and enter a valid shipping charge.',
      });
      return;
    }
    const newShippingRule: ShippingRule = {
      id: newRule.district.toLowerCase().replace(/\s+/g, '-'),
      district: newRule.district,
      charge: charge,
    };
    setRules((prev) => [...prev, newShippingRule]);
    setNewRule({ district: '', charge: '' });
    setIsNewRuleDialogOpen(false);
    toast({
      title: 'Success',
      description: `Shipping rule for "${newShippingRule.district}" has been added.`,
    });
  };

  const handleEditRule = () => {
    if (!editingRule || !editingRule.district || isNaN(editingRule.charge) || editingRule.charge < 0) {
       toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter valid details for the shipping rule.',
      });
      return;
    }
    setRules(prev => prev.map(r => r.id === editingRule.id ? editingRule : r));
    setEditingRule(null);
    toast({
      title: 'Success',
      description: 'Shipping rule has been updated.',
    });
  };

  const handleDeleteRule = (ruleId: string) => {
    setRules(prev => prev.filter(r => r.id !== ruleId));
     toast({
      title: 'Success',
      description: 'Shipping rule has been deleted.',
    });
  };

  return (
    <div className="flex flex-col">
      <header className="flex h-16 items-center justify-between border-b bg-background px-6 shrink-0">
        <h1 className="text-xl font-semibold tracking-tight">Shipping Charges</h1>
         <Dialog open={isNewRuleDialogOpen} onOpenChange={setIsNewRuleDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Shipping Rule
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Shipping Rule</DialogTitle>
              <DialogDescription>
                Set a specific shipping charge for a district.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="district" className="text-right">
                  District
                </Label>
                <Select onValueChange={(value) => setNewRule(prev => ({...prev, district: value}))}>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a district" />
                    </SelectTrigger>
                    <SelectContent>
                        {bangladeshDistricts.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="charge" className="text-right">
                  Charge (BDT)
                </Label>
                <Input
                  id="charge"
                  type="number"
                  value={newRule.charge}
                  onChange={(e) => setNewRule(prev => ({...prev, charge: e.target.value}))}
                  className="col-span-3"
                  placeholder="e.g. 80"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                 <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleAddRule}>Save Rule</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>
      <main className="flex-1 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Shipping Rules</CardTitle>
            <CardDescription>
              Manage shipping charges for different districts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>District</TableHead>
                  <TableHead>Shipping Charge (BDT)</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell className="font-medium">{rule.district}</TableCell>
                    <TableCell>{rule.charge.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                       <Dialog open={!!editingRule && editingRule.id === rule.id} onOpenChange={(isOpen) => !isOpen && setEditingRule(null)}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                             <DialogTrigger asChild>
                                <DropdownMenuItem onSelect={() => setEditingRule(rule)}>Edit</DropdownMenuItem>
                            </DialogTrigger>
                            <DropdownMenuItem
                              className="text-red-600"
                              onSelect={() => handleDeleteRule(rule.id)}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <DialogContent>
                            <DialogHeader>
                            <DialogTitle>Edit Shipping Rule</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className="text-right">District</Label>
                                    <Input value={editingRule?.district || ''} className="col-span-3" readOnly disabled />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="edit-charge" className="text-right">Charge (BDT)</Label>
                                    <Input
                                        id="edit-charge"
                                        type="number"
                                        value={editingRule?.charge || ''}
                                        onChange={(e) =>
                                            setEditingRule(
                                            (prev) => prev ? { ...prev, charge: parseInt(e.target.value) || 0 } : null
                                            )
                                        }
                                        className="col-span-3"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setEditingRule(null)}>Cancel</Button>
                                <Button onClick={handleEditRule}>Save Changes</Button>
                            </DialogFooter>
                        </DialogContent>
                       </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
