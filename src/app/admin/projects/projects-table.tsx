"use client"
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { api } from "@/lib/client/api";
import { queryClient } from "@/lib/client/query-client";
import { Projects } from "@/lib/types/projects";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { CreateUpdateProjects } from "./create-update";
import { useState } from "react";

export function ProjectsTable({initialData}: {initialData: Projects[]}){
    const {data: projects} = useQuery({
        queryKey: ["projects"],
        queryFn: async ()=>{
            return (await api.projects.get()).data
        },
        initialData: initialData,
    })

    return(
        <DataTable columns={columns} data={projects ?? []} />
        
    )
}
 
const columns: ColumnDef<Projects>[] = [
    {
        accessorKey: "name",
        header: "Название",
        cell: ({row}) =>{
           return <p>{row.original.name}</p> // для надежности или если в accessoryKey другое значение 
        }
    },
    {
        accessorKey: "stage",
        header: "Стадия",
        cell: ({row}) =>{
           return <p>{row.original.stage}</p> 
        }
    },
    {
        accessorKey: "industriesId",
        header: "Отрасль",
        cell: ({row}) =>{
           return <p>{row.original.industries?.name ?? ""}</p> 
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
        header: () => <CreateUpdateProjects/>,
        cell: ({row}) =>{
            return(
                <div className = "flex gap-5">
                    <CreateUpdateProjects projects={row.original}/>
                    <Deleteprojects projects = {row.original}/>
                </div>
            )
        }
    }

]


function Deleteprojects({projects}: {projects: Projects}){
    const [isOpen, setIsOpen] = useState(false)
    const deleteMutation = useMutation({
        mutationKey: ["deleteProjects"],
        mutationFn: async ()=>{
            const response = await api.projects({ id: projects.id }).delete()
            if (response.error) {
                const errorMessage = `${response.error.status} ${response.error.value.type || response.error.value.message || response.error.value.summary} `;
                throw new Error(errorMessage);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["projects"]
            })
            toast.success("Стартап успешно удалён")
            setIsOpen(false)
        },
        onError: (err: Error)=>{
                    toast.error(`Ошибка удаления стартапа:
                         ${err.message || err.name}`)
                }
    })

    return(
        <Dialog open = {isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant={"destructive"}>Удалить</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogTitle>Удаление стартапа</DialogTitle>
                <p>Вы действительно хотите удалить стартап "{projects.name}"?</p>
                
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant={"outline"}>Отмена</Button>
                        
                    </DialogClose>

                    <Button variant={"destructive"} onClick={() => deleteMutation.mutate()}>Удалить</Button>
                </DialogFooter>

            </DialogContent>

        </Dialog>
    )
}