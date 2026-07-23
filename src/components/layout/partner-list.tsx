import Partner from "../ui/partner"

export default function PartnerList(){
    const partner: string[] = [
    "Партнер1",
    "Партнер2",
    "Партнер3",
    "Партнер4",
]
    return(
        <div className="flex md:flex-row flex-col gap-4 xl:gap-6 items-center">
            {partner.map((item,index)=>(
                <Partner key={index} partner={item}/>
            ))}
        </div>
    )
}