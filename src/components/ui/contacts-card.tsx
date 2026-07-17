import { Contacts } from "@/app/contacts/contacts-img";

export default function ContactsCard({item}:{item:Contacts}){
    return(
        <div className="flex flex-col gap-4 text-tBlack-main">
            <img className="h-80 w-fill rounded-[100%]" src={item.imgSrc} alt={item.title} />
            <div >
                <p className="text-[32px]">{item.title}</p>
                <p className="text-xl text-tGray-sub">{item.subTitle}</p>
            </div>
            <p className="text-xl underline">{item.email}</p>
        </div>
    )
}