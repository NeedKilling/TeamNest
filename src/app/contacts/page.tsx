import ContactsImg from "./contacts-img";

export default function Contacts(){
    return(
        
        <main>
            <section className="relative mx-auto  text-center   flex flex-col ">


                <div className="bg-[url(../../public/img/Hero.svg)] bg-cover pt-[133px] flex flex-col items-center">
                    <div className="pb-[450px] xl:pb-[478px] container  lg:w-[1312px]">
                        <div className="relative">
                            <h1 className=" w-[398px] lg:w-full mx-auto font-unbounded font-medium text-[78.1px] md:text-[180] xl:text-[257.25px] text-tBlack-main">Founder</h1>
                            <img className="mx-auto absolute    top-[90]    xl:top-[100px]  left-1/2 -translate-x-1/2 w-[547px] h-[526px] xl:w-[808px] xl:h-[950px]" src="/img/CEO.png" alt="CEO" />
                        </div>
                        <div className="flex justify-between w-[398px] sm:w-[500px] container xl:w-full mx-auto text-tBlack-main font-medium text-xl xl:text-5xl">
                            <p>Сёмин Олег</p>
                            <p>CEO</p>
                        </div>

                        
                    </div>
                </div>

                
                <div className="w-full relative pb-12 isolate">
                        <div className="container w-[398px] lg:w-[980px] mx-auto text-tBlack-main text-2xl md:text-3xl lg:text-5xl font-medium flex flex-col gap-4 items-center relative z-10">
                            <p className="">Создай свое будущее вместе с </p>
                            <img src="/img/Logo (2).png" className="h-6" alt="" />
                        </div>

                        <img className="h-[380px] w-full z-1 absolute top-[-170px] xl:top-[-150px]" src="/img/Ellipse 21@2x.png" alt="" />
                </div>
                {/* <div className="absolute inset-x-0 bottom-0 h-[294px] w-full bg-gradient-to-t from-white to-transparent pointer-events-none"/> */}
                
                       
                       
                   
            <ContactsImg/> 
                 
            </section>
        </main>
        
    )
}