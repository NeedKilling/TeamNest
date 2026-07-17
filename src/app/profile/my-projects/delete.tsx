import { api } from "@/lib/client/api";
import { queryClient } from "@/lib/client/query-client";
import { Projects } from "@/lib/types/projects";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function DeleteProjects({project}: {project: Projects}){
    const [isOpen, setIsOpen] = useState(false)
    const deleteMutation = useMutation({
        mutationKey: ["deleteProjects"],
        mutationFn: async ()=>{
            const response = await api.projects({ id: project.id }).delete()
            if (response.error) {
                const errorMessage = `${response.error.status} ${response.error.value.type || response.error.value.message || response.error.value.summary} `;
                throw new Error(errorMessage);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["my-projects"]
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
                <Button className="h-10 text-base" variant={"destructive"}>Удалить</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogTitle>Удаление стартапа</DialogTitle>
                <p>Вы действительно хотите удалить стартап "{project.name}"?</p>
                
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