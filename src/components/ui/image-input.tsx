
import { api } from "@/lib/client/api";
import { filesSchema } from "@/lib/schemas/files";
import { useMutation } from "@tanstack/react-query";
import z from "zod/v4";
import { Input } from "./input";

export default function ImageInput({onChange}: {onChange: (e: string) => void}){

    const uploadImageMutation = useMutation({
        mutationKey: ["upload-image"],
        mutationFn: async (data: z.infer<typeof filesSchema>) => {
            return (await api.files.post(data)).data
        }
    })

    return(
        <div className="flex items-end">
            <label htmlFor="image-file" className = " p-2 rounded-xl placeholder:bg-white-100">файл</label>
            <Input id="image-file" className = "w-full hidden " type="file" name = "image-file" 
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