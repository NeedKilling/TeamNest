
import { api } from "@/lib/client/api";
import { filesSchema } from "@/lib/schemas/files";
import { useMutation } from "@tanstack/react-query";
import z from "zod/v4";
import { Input } from "./input";

export default function AvatarInput({onChange}: {onChange: (e: string) => void}){

    const uploadImageMutation = useMutation({
        mutationKey: ["upload-image"],
        mutationFn: async (data: z.infer<typeof filesSchema>) => {
            return (await api.files.post(data)).data
        }
    })

    return(
        <div className="flex flex-col w-fit justify-center items-center">
            <label htmlFor="image-file" className = "w-full p-2 rounded-xl placeholder:bg-white-100">Загрузить аватар</label>
            <Input id="image-file" className = " hidden " type="file" name = "image-file" 
                accept=".jpg, .png, .jpeg"

            onChange={(e)=>{
                if (e.target.files && e.target.files[0]) {
                    uploadImageMutation.mutate({ file: e.target.files[0] },
                    {
                        onSuccess: (id) => {
                            onChange(id!)
                        }
                    }
                    ) 
                }    
            }}
            />
        </div>
    )
}