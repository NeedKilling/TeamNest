"use client"

import AvatarInput from "@/components/ui/avatar-input"
import { Spinner } from "@/components/ui/spinner"
import { authClient } from "@/lib/client/auth-client"
import { queryClient } from "@/lib/client/query-client"
import { useMutation } from "@tanstack/react-query"
import Image from "next/image"



export default function AccountData(){
const imgUrl = "/api/files/"


    const {data: session, isPending, error,refetch} = authClient.useSession()
    const avatarMutation = useMutation({
        mutationFn: async(id:string)=>{
            await authClient.updateUser({
                image: id,
            });
        },
        onSuccess: async () => {
            await refetch();
            queryClient.invalidateQueries({ queryKey: ["personnels"] });
        },onError: (err) => {
            console.error("Ошибка добавления аватара:", err)
        }
    })

      const handleAvatarChange = (imageId: string) => {
            if (imageId) {
                avatarMutation.mutate(imageId);
            }
        };
    return(
        <div className="flex flex-col gap-3 justify-center items-center">
            {/* <Avatar size="lg" className="!w-[50px] !h-[50px]" >
                <AvatarImage src={user?.image ? `${imgUrl+user.image}` : "/img/avatar.svg"}/>
                <AvatarFallback>CN</AvatarFallback>
            </Avatar> */}
            
            <div className="flex gap-2 text-xl text-tBlack-main font-medium">
                <p>{session?.user?.name}</p>
                <p>{session?.user?.lastName}</p>
            </div>
            <div>
                <p>{session?.user?.email}</p>
            </div>


            <div className="flex flex-col gap-2 items-center">
                <img className="w-[100px] h-[100px] shrink-0 rounded-[100%]" src={session?.user?.image ? `${imgUrl+session?.user.image}` : "/img/avatar.svg"} alt={"avatar"}/>
                <AvatarInput onChange={handleAvatarChange}/>
            </div>
        </div>
    )
}