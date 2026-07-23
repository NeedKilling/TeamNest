import { ArrowUpRight } from 'lucide-react';
export default function Partner({partner}: {partner:  string}){
    return(
        <div className='flex items-center'>
            <p className='text-base xl:text-xl text-tBlack-main'>{`{${partner}}`}</p>
            <ArrowUpRight className="w-[16px] h-[16px] lg:w-[24px] lg:h-[24px]"/>
        </div>
        
    )
}