export type Contacts = {  
        title: string,
        subTitle: string,
        imgSrc: string,
        email: string,
    }

export default function ContactsImg(){
    

    const AboutList:Contacts[] = [
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
        <div>

        </div>
    )
}