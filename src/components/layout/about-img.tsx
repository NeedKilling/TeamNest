import AboutCard from "../ui/about-card"


export type About = {  
        title: string,
        subTitle: string,
        imgSrc: string,
    }

export function AboutImg(){
    

    const AboutList:About[] = [
        {title: "Поиск команды",
        subTitle:"TeamNest упрощает поиск единомышленников — здесь вы сможете найти разработчиков, дизайнеров, маркетологов и других специалистов, готовых взяться за реализацию идеи.",
        imgSrc: "/img/IMG.png"},
        {title: "Возможности для роста",
        subTitle:"Платформа открыта для тех, кто ищет опыт, хочет развить навыки и узнать, что значит работать над стартапом изнутри.",
        imgSrc: "/img/IMG (1).png"},
        {title: "Сеть поддержки и развития",
        subTitle:"Мы создаем сообщество, где можно найти не только команду, но и наставников, советчиков и будущих партнеров",
        imgSrc: "/img/IMG (2).png"},
    ]

    return(
        <div className="flex flex-col xl:flex-row xl:justify-between gap-6 xl:gap-9">
            {AboutList.map((item,index)=><AboutCard key = {index} card={item}/>)}
        </div>
    )
}