  "use client";
  import Image from "next/image";
  import { Button } from '@/components/ui/button';
  import { Card } from "@/components/ui/card";
  import { Input } from "@/components/ui/input";
  import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
  } from "@/components/ui/empty"
  import {
    Table,
    TableCaption,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    TableFooter
  } from "@/components/ui/table";
  import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
  import { useState, useEffect } from "react";
  import { supabase } from "@/lib/supabase";
  import { DropdownMenu, 
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator
  } from "@/components/ui/dropdown-menu";
  import { MoreHorizontalIcon } from "lucide-react";



export default function Home() {

  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")

    if (error) {
      console.error(error)
    } else {
      setProducts(data)
    }
  }

  const [productName, setProductName] = useState("")
  const [sku, setSku] = useState("")
  const [costPrice, setCostPrice] = useState("")
  const [sellingPrice, setSellingPrice] = useState("")
  const [stock, setStock] = useState("")

  const handleSave = async () => {
    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          product_name: productName,
          sku: sku,
          cost_price: costPrice,
          selling_price: sellingPrice,
          stock: stock,
        },
      ]);

    if (error) {
      console.error(error);
    } else {
      console.log("Saved!");
    }

    setProductName("");
    setSku("");
    setCostPrice("");
    setSellingPrice("");
    setStock("");
  };

  const handleDelete = async (id: number) => {
    alert(';asd')
    const { data, error } = await supabase
      .from("products")
      .delete()
      .eq("id", id)
    if (error) {
      console.error(error);
    } else {
      fetchProducts();
    }
  }
  
  return (
    <div className="m-4 p-2 w-[800px] mx-auto">
      <Table className="border-1 mb-2">
        {/* <TableCaption>Inventory</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Product Name</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Cost Price</TableHead>
            <TableHead>Selling Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6}>
                <Empty>
                  <EmptyTitle>No products yet.</EmptyTitle>
                  <EmptyDescription>
                    You haven't created any products yet.
                  </EmptyDescription>
                </Empty>
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.product_name}</TableCell>
                <TableCell className="font-medium">{product.sku}</TableCell>
                <TableCell>{product.cost_price}</TableCell>
                <TableCell>{product.selling_price}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="size-8"><MoreHorizontalIcon /><span className="sr-only">Open menu</span></Button>} />
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive" onClick={() => handleDelete(product.id)}>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
        {/* <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">$2,500.00</TableCell>
          </TableRow>
        </TableFooter> */}
      </Table>
      
      <Card className="p-8">
        <Field orientation="horizontal">
          <div className="w-full">
            <FieldLabel htmlFor="productName">Product Name <span className="text-destructive">*</span></FieldLabel>
            <Input required id="productName" value={productName} onChange={(e)=>setProductName(e.target.value)}></Input>
          </div>
          
          <div className="w-full">
            <FieldLabel htmlFor="SKU">SKU <span className="text-destructive">*</span></FieldLabel>
            <Input required id="SKU" value={sku} onChange={(e)=>setSku(e.target.value)}></Input>
          </div>
        </Field>
        
        <Field orientation="horizontal">
          <div className="w-full">
            <FieldLabel>Cost Price <span className="text-destructive">*</span></FieldLabel>
            <Input required id="costPrice" value={costPrice} onChange={(e)=>setCostPrice(e.target.value)}></Input>
          </div>
          <div className="w-full">
            <FieldLabel>Selling Price <span className="text-destructive">*</span></FieldLabel>
            <Input required id="sellingPrice" value={sellingPrice} onChange={(e)=>setSellingPrice(e.target.value)}></Input>
          </div>

          <div>
            <FieldLabel>Stock <span className="text-destructive">*</span></FieldLabel>
            <Input required id="stock" value={stock} onChange={(e)=>setStock(e.target.value)}></Input>
          </div>

        </Field>

        <div className="flex justify-end">
          <Button className="cursor-pointer" onClick={handleSave}>Save</Button>
        </div>
      </Card>
    </div>
  );
}
