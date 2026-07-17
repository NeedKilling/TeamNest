import ContactsCard from "@/components/ui/contacts-card"

export type Contacts = {  
        title: string,
        subTitle: string,
        imgSrc: string,
        email: string,
    }

export default function ContactsImg(){
    

    const Contacts:Contacts[] = [
        {title: "Лобов Александр",
        subTitle:"Технический директор",
        imgSrc: "/img/1.jpg",
        email: "nd@TeamNest.ru"},
        {title: "Лобов Александр",
        subTitle:"Технический директор",
        imgSrc: "/img/2.jpg",
        email: "nd@TeamNest.ru"},
        {title: "Лобов Александр",
        subTitle:"Технический директор",
        imgSrc: "/img/3.png",
        email: "nd@TeamNest.ru"},
        
    ]

    return(
        <div className="py-12 flex justify-center gap-32 container w-[1312px] mx-auto ">
            {Contacts.map((item,index)=>(
                <ContactsCard key={index} item={item}/>
            ))}
        </div>  
    )
}