import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { api } from "@/server/api"
import { auth } from "@/server/auth/auth"
import { headers as nextHeaders} from "next/headers"
import { PublicData } from "./public-data";
import { Personnel } from "@/lib/types/personnel";
import Image from "next/image";
import AccountData from "./account-data";

export default async function Profile(){
    const session = await auth.api.getSession({
        headers: await nextHeaders()
    })
    const user = session?.user;
    const personnel =  (await api.personnel({id: user?.personnelId!}).get()).data as Personnel
    console.log(personnel)

    
    return (
        <div className="flex-1 flex flex-col gap-5">
            <div className="border rounded-xl  p-5 bg-gray-component flex flex-col gap-3">
                <div className="flex flex-col gap-2 justify-start">
                    <h2 className="text-tBlack-main font-medium text-2xl">Учетные данные</h2>
                </div>
                <AccountData/>
            </div>


            <div className="border rounded-xl  p-5 bg-gray-component">
                <div className="flex flex-col gap-2">
                    <h2 className="text-tBlack-main font-medium text-2xl">Публичные данные</h2>
                    <p className="text-tGray-sub text-base pl-2 text-center">Для взаимодействия с нашим сайтом вы размещаете свои персональные данные в данном разделе. Информация, которую вы укажете, публичная. Она располагается на странице "Кадры" и видна другим пользователям сети Интернет.</p>
                    <p  className="text-tGray-sub text-base pl-2 text-center">Минимальный допуск для доступа к разделу "Кадры" укажите ваше резюме и образование</p>
                </div>

                <PublicData initialData={personnel!}/>



            </div>
        </div>
    )
}