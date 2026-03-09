import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface SliderItem {
  imgUrl: string;
  title: string;
  subtitle: string;
}

const sliderData: SliderItem[] = [
  {
    imgUrl: "https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Premium Seeds",
    subtitle: "Grow healthy plants from high quality seeds",
  },
  {
    imgUrl: "https://images.unsplash.com/photo-1457530378978-8bac673b8062?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Beautiful Pots",
    subtitle: "Decorate your garden with stylish pots",
  },
  {
    imgUrl: "https://images.unsplash.com/photo-1507484467459-0c01be16726e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Organic Fertilizers",
    subtitle: "Boost plant growth naturally",
  },
];
export const Slider = () => {
  return (
    <div className="w-full h-screen overflow-hidden p-2">
      <Carousel opts={{ loop: true }} className="w-full h-screen">
        <CarouselContent className="ml-0">
          {sliderData.map((item, index) => (
            <CarouselItem key={index} className="pl-0">
              <div className="relative w-full h-screen">
                <img
                  src={item.imgUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
                  <h1 className="text-4xl font-bold">{item.title}</h1>
                  <p className="mt-2 text-lg">{item.subtitle}</p>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Move buttons INSIDE the slide area, not outside the overflow boundary */}
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
    </div>
  );
};