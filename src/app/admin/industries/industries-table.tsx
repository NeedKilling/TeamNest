"use client"
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { api } from "@/lib/client/api";
import { queryClient } from "@/lib/client/query-client";
import { Industries } from "@/lib/types/industries";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { CreateUpdateIndustries } from "./create-update";

export function IndustriesTable({initialData}: {initialData: Industries[]}){
    const {data: industries} = useQuery({
        queryKey: ["industries"],
        queryFn: async ()=>{
            return (await api.industries.get()).data
        },
        initialData: initialData,
    })

    return(
        <DataTable columns={columns} data={industries!}/>
        
    )
}

const columns: ColumnDef<Industries>[] = [
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
        header: () => <CreateUpdateIndustries/>,
        cell: ({row}) =>{
            return(
                <div className = "flex gap-5">
                    <CreateUpdateIndustries industries={row.original}/>
                    <DeleteIndustries industries = {row.original}/>
                </div>
            )
        }
    }

]


function DeleteIndustries({industries}: {industries: Industries}){

    const deleteMutation = useMutation({
        mutationKey: ["deleteIndustries"],
        mutationFn: async ()=>{
            const response = await api.industries({ id: industries.id }).delete()
            if (response.error) {
                const errorMessage = `${response.error.status} ${response.error.value.type || response.error.value.message || response.error.value.summary} `;
                throw new Error(errorMessage);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["industries"]
            })
            toast.success("Отрасль успешно удалена")
        },
        onError: (err: Error)=>{
                    toast.error(`Ошибка удаления отрасли:
                         ${err.message || err.name}`)
                }
    })

    return(
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={"destructive"}>Удалить</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogTitle>Удаление отрасли</DialogTitle>
                <p>Вы действительно хотите удалить отрасль "{industries.name}"?</p>
                
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