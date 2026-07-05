"use client"
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { api } from "@/lib/client/api";
import { queryClient } from "@/lib/client/query-client";
import { Categories } from "@/lib/types/categories";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { CreateUpdateCategories } from "./create-update";

export function CategoriesTable({initialData}: {initialData: Categories[]}){
    const {data: categories} = useQuery({
        queryKey: ["categories"],
        queryFn: async ()=>{
            return (await api.categories.get()).data
        },
        initialData: initialData,
    })

    return(
        <DataTable columns={columns} data={categories!}/>
        
    )
}

const columns: ColumnDef<Categories>[] = [
    {
        accessorKey: "name",
        header: "Название",
        cell: ({row}) =>{
           return <p>{row.original.name}</p> // для надежности или если в accessoryKey другое значение 
        }
    },
    {
        accessorKey: "createdAt",
        header: "Дата создания",
        cell: ({row}) =>{
            const date = typeof row.original.createdAt === 'string'
                ? new Date(row.original.createdAt)
                : row.original.createdAt;
           return <p>{date.toUTCString()}</p>
        }
    },
    {
        accessorKey: "action",
        header: () => <CreateUpdateCategories/>,
        cell: ({row}) =>{
            return(
                <div className = "flex gap-5">
                    <CreateUpdateCategories categories={row.original}/>
                    <DeleteCategories categories = {row.original}/>
                </div>
            )
        }
    }

]


function DeleteCategories({categories}: {categories: Categories}){

    const deleteMutation = useMutation({
        mutationKey: ["deleteCategories"],
        mutationFn: async ()=>{
            const response = await api.categories({ id: categories.id }).delete()
            if (response.error) {
                const errorMessage = `${response.error.status} ${response.error.value.type || response.error.value.message || response.error.value.summary} `;
                throw new Error(errorMessage);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["categories"]
            })
            toast.success("Категория успешно удалена")
        },
        onError: (err: Error)=>{
                    toast.error(`Ошибка удаления категории:
                         ${err.message || err.name}`)
                }
    })

    return(
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={"destructive"}>Удалить</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogTitle>Удаление категории</DialogTitle>
                <p>Вы действительно хотите удалить категорию "{categories.name}"?</p>
                
                <DialogFooter>
                    <DialogClose>
                        <Button variant={"outline"}>Отмена</Button>
                        
                    </DialogClose>

                    <Button variant={"destructive"} onClick={() => deleteMutation.mutate()}>Удалить</Button>
                </DialogFooter>

            </DialogContent>

        </Dialog>
    )
}