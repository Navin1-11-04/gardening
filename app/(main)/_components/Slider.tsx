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
    imgUrl: "/images/seed.jpg",
    title: "Premium Seeds",
    subtitle: "Grow healthy plants from high quality seeds",
  },
  {
    imgUrl: "/images/pots.jpg",
    title: "Beautiful Pots",
    subtitle: "Decorate your garden with stylish pots",
  },
  {
    imgUrl: "/images/fertilizer.jpg",
    title: "Organic Fertilizers",
    subtitle: "Boost plant growth naturally",
  },
];

export const Slider = () => {
  return (
    <div className="w-full h-screen overflow-hidden">
      <Carousel>
        <CarouselContent>
          {sliderData.map((item, index) => (
            <CarouselItem key={index}>
              <div className="relative w-full h-screen">
                <img
                  src={item.imgUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white text-center">
                  <h1 className="text-4xl font-bold">{item.title}</h1>
                  <p className="mt-2 text-lg">{item.subtitle}</p>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};