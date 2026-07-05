"use client"
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { api } from "@/lib/client/api";
import { queryClient } from "@/lib/client/query-client";
import { Specialization } from "@/lib/types/specialization";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { CreateUpdateSpecialization } from "./create-update";

export function SpecializationTable({initialData}: {initialData: Specialization[]}){
    const {data: specialization} = useQuery({
        queryKey: ["specialization"],
        queryFn: async ()=>{
            return (await api.specialization.get()).data
        },
        initialData: initialData,
    })

    return(
        <DataTable columns={columns} data={specialization!}/>
        
    )
}

const columns: ColumnDef<Specialization>[] = [
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
        header: () => <CreateUpdateSpecialization/>,
        cell: ({row}) =>{
            return(
                <div className = "flex gap-5">
                    <CreateUpdateSpecialization specialization={row.original}/>
                    <Deletespecialization specialization = {row.original}/>
                </div>
            )
        }
    }

]


function Deletespecialization({specialization}: {specialization: Specialization}){

    const deleteMutation = useMutation({
        mutationKey: ["deleteSpecialization"],
        mutationFn: async ()=>{
            const response = await api.specialization({ id: specialization.id }).delete()
            if (response.error) {
                const errorMessage = `${response.error.status} ${response.error.value.type || response.error.value.message || response.error.value.summary} `;
                throw new Error(errorMessage);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["specialization"]
            })
            toast.success("Специальность успешно удалена")
        },
        onError: (err: Error)=>{
                    toast.error(`Ошибка удаления специальности:
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
                <p>Вы действительно хотите удалить специальность "{specialization.name}"?</p>
                
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