import { Projects } from "@/lib/types/projects";

export default function InviteProjects({project,isSelected,  onSelect}: {project: Projects, isSelected:boolean,onSelect:()=>void}){

    const imgUrl = "http://localhost:3000/api/files/"
    return(
        <div  className={`border bg-gray-component flex flex-col gap-2 md:gap-4 rounded-[16px] w-[170px] md:w-[286px] cursor-pointer transition-all 
            ${isSelected ? " border-[#0B76FA]" : "border-gray-border"}`} onClick={onSelect}>
                <img className = "w-full h-[100px] md:h-[200px] object-cover rounded-t-[16px]" src={imgUrl+project.image} 
                    onError={(e)=>{e.currentTarget.src = "/img/noImage.png"
                        
                    }} alt="project image" 
                    />
                    
                        
                <div className="p-2 md:p-4 pt-0 pt-0 flex flex-col  text-tBlack-main">
                    <h3 className="text-base md:text-xl font-medium ">{project.name}</h3>
                    <p className="text-[14px] text-tGray-sub md:text-base">{project.industries.name}</p>
                                             
                </div>
        </div>

    
    )
}