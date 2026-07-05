import { api } from "@/server/api"
import { CategoriesTable } from "./categories-table"

export default async function AdminCategoriesPage(){

    const categories = (await api.categories.get()).data 
    
    return(
            <CategoriesTable initialData = {categories!}/>
    )
}
