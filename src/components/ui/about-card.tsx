import { About } from "../layout/about-img";

export default function AboutCard({card}: {card: About}){
    return(
        <div className="p-4 bg-gray-component flex-1 rounded-[16px] border border-gray-border">
            <img className="h-64 w-fill" src={card.imgSrc} alt={card.title} />
            <div className="mt-4">
                <h3 className="text-2xl font-medium text-tBlack-main">{card.title}</h3>
                <p className="text-base font-normal text-tGray-sub mt-[6px]">{card.subTitle}</p>
            </div>
        </div>
    )
}