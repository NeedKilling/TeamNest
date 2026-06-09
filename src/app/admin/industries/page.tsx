import { api } from "@/server/api"
import { IndustriesForm } from "./industries-form"


export default async function  IndustriesPage(){

    const industries = (await api.industries.get()).data

    return (
        <div className="container h-[100vh] mx-auto bg-gray-300 flex flex-col align-center items-center gap-5">
            <h1>Categories</h1>
            <div className="flex gap-20">
                <div className="flex flex-col align-center items-center gap-5 ">
                        {industries?.map((item)=>(
                    <div key={item.id} className="border rounded-xl p-4 bg-green-100">
                        <div>{item.name}</div>          
                        {/* <div>{item.createdAt.toISOString()}</div> */}
                    </div>
                    ))} 
                </div>
                <IndustriesForm/>
            </div>
            
        </div>
    )
}